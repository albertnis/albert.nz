import { basename } from 'node:path'
import { readFile } from 'node:fs/promises'
import type { Plugin, ResolvedConfig } from 'vite'
import type { ViteGpxPluginOutput } from './types'
import geojson from '@mapbox/togeojson'
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson'
import { DOMParser } from 'xmldom'
import { differenceInHours, intervalToDuration, parseISO } from 'date-fns'

export function gpxPlugin(): Plugin {
	let basePath: string
	const gpxPaths = new Map()
	return {
		name: 'vite-plugin-gpx',
		configResolved(cfg) {
			const viteConfig = cfg
			basePath = (viteConfig.base?.replace(/\/$/, '') || '') + '/@gpx/'
		},
		async load(id) {
			if (!/\.gpx$/.test(id)) return null

			const srcURL = new URL(id, 'file://')
			const fileContents = await readFile(decodeURIComponent(srcURL.pathname))

			gpxPaths.set(basename(srcURL.pathname), id)

			let src: string
			if (!this.meta.watchMode) {
				const handle = this.emitFile({
					name: basename(srcURL.pathname),
					source: fileContents,
					type: 'asset'
				})

				src = `__VITE_ASSET__${handle}__`
			} else {
				src = basePath + basename(srcURL.pathname)
			}

			// Call processing code
			const pluginOutput = gpxDataToOutput(fileContents.toString(), src)

			return {
				code: `export default ${JSON.stringify(pluginOutput)}`
			}
		},
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (req.url?.startsWith(basePath)) {
					const [, id] = req.url.split(basePath)

					const gpxPath = gpxPaths.get(id)

					if (!gpxPath)
						throw new Error(
							`gpx cannot find GPX file with id "${id}" this is likely an internal error. Files are ${JSON.stringify(
								gpxPaths
							)}`
						)

					res.setHeader('Content-Type', 'application/gpx+xml')
					res.setHeader('Cache-Control', 'max-age=360000')
					const buffer = await readFile(gpxPath)
					const contents = buffer.toString()
					return res.end(contents)
				}

				next()
			})
		}
	}
}

/**
 * Process GPX file into output object
 * @param gpxData String contents of a GPX file
 * @param path URL to the file
 * @returns Output containing data about the parsed GPX file, for use by plugin consumers
 */
const gpxDataToOutput = (gpxData: string, path: string): ViteGpxPluginOutput => {
	const gpxXmlDocument = new DOMParser().parseFromString(gpxData)
	const gj = geojson.gpx(gpxXmlDocument)

	if (gj.type !== 'FeatureCollection') {
		throw new TypeError('Coverted GeoJSON is not of type FeatureCollection')
	}

	if (gj.features.length < 1) {
		throw new TypeError('Coverted GeoJSON FeatureCollection must have at least one feature')
	}

	const feature = gj.features.find((f) => f.type === 'Feature')

	if (feature == null) {
		throw new TypeError('Coverted GeoJSON FeatureCollection must contain a Feature')
	}

	if (feature.geometry.type != 'LineString') {
		throw new TypeError('Feature geometry is not LineString')
	}

	const coordinatesDataCount = feature.geometry.coordinates.length

	// Compute path data

	const targetPathDataCount = Math.pow(coordinatesDataCount, 0.7) // Downsample more aggressively as path size increases
	const pathSamplingPeriod = Math.floor(coordinatesDataCount / targetPathDataCount)
	const downSampledCoordinates = downSampleArray(feature.geometry.coordinates, pathSamplingPeriod)
	const downSampledGeometry: Geometry = {
		...feature.geometry,
		coordinates: downSampledCoordinates.map((c) => [c[0], c[1]]) // Strip out elevation data
	}
	const cumulativeDistancesMetres = computeCumulutiveDistanceMetres(downSampledCoordinates)
	const distanceMetres = cumulativeDistancesMetres[cumulativeDistancesMetres.length - 1]

	// Compute elevation data

	const targetElevationDataCount = 900 // Aim for width of elevation graph in pixels
	const elevationSamplingPeriod =
		coordinatesDataCount < targetElevationDataCount
			? 1 // Use all the datapoints if there are fewer
			: Math.floor(coordinatesDataCount / targetElevationDataCount) // Downsample

	const downSampledGeometryForElevation = downSampleArray(
		feature.geometry.coordinates,
		elevationSamplingPeriod
	)
	const downSampledElevations = downSampledGeometryForElevation.map((g) => g[2])
	const cumulativeDistancesForElevation = computeCumulutiveDistanceMetres(
		downSampledGeometryForElevation
	)

	return {
		elevationData: {
			downSampledElevations,
			elevationGainMetres:
				feature.geometry.coordinates[0].length === 3
					? computeCumulativeElevationGainMetres(feature.geometry.coordinates)
					: null,
			samplingPeriod: elevationSamplingPeriod
		},
		metadata: {
			gpxFilePath: path,
			breakIndices: computeBreakIndices(feature),
			duration: computeDuration(feature),
			startTime: computeStartTime(feature),
			distanceMetres
		},
		pathData: {
			geoJson: buildGeoJSONFromGeometry(downSampledGeometry),
			cumulativeDistancesMetres,
			samplingPeriod: pathSamplingPeriod
		}
	}
}

const buildGeoJSONFromGeometry = (geometry: Geometry): FeatureCollection => ({
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {},
			geometry
		}
	]
})

/**
 * Downsample an array by skipping over values
 * @param input Array of values at high sample rate
 * @param period Proportion of values to keep. e.g. 1 will take every value, 3 will take every third
 * @returns Array of values at low sample rate
 */
const downSampleArray = <T>(input: T[], period: number): T[] => {
	if (period < 1 || period % 1 != 0) {
		throw new TypeError('Period must be an integer greater than or equal to 1')
	}

	if (period === 1) {
		// Return a copy of input
		return [...input]
	}

	const output: T[] = []

	for (let i = 0; i < input.length; i += period) {
		output.push(input[i])
	}

	return output
}

/**
 * Calculate the duration from the `coordTime`s stored in a feature's property
 * @param input Feature to use for calculating duration
 * @returns Duration between first and last `coordTime` in the feature
 */
const computeDuration = (input: Feature): Duration | null => {
	const times = input.properties?.coordTimes
	if (times == null || !Array.isArray(times)) {
		return null
	}

	const start = parseISO(times[0])
	const end = parseISO(times[times.length - 1])

	return intervalToDuration({ start, end })
}

/**
 * Calculate the start time from a feature
 * @param input Feature to use for calculating start time
 * @returns Date object representing the feature's `time` property, or the first `coordTime` if there is no such property
 */
const computeStartTime = (input: Feature): Date | null => {
	const startTime = input.properties?.time

	if (typeof startTime === 'string') {
		return parseISO(startTime)
	}

	const times = input.properties?.coordTimes

	if (Array.isArray(times)) {
		return parseISO(times[0])
	}

	return null
}

/**
 * Compute the locations of breaks exceeding four hours within a feature
 * @param input Feature with coordTimes data used to evaluate breaks
 * @returns Array of indexes where each index corresponds to a coordinate after which there were no coordinates recorded for at least four hours
 */
const computeBreakIndices = (input: Feature): number[] => {
	// Self-contained sampling rate to accelerate calcs
	// Can ususally set this high unless there are lots of stops
	const samplingRate = 30

	const times = input.properties?.coordTimes

	if (!Array.isArray(times)) {
		return []
	}

	// Get the date objects for a subsampled set of timestamps
	const parsedTimes = times.filter((_, i) => i % samplingRate === 0).map((t) => parseISO(t))

	const indices = []
	for (let i = 1; i < parsedTimes.length; i++) {
		if (differenceInHours(parsedTimes[i], parsedTimes[i - 1]) > 4) {
			indices.push((i - 1) * samplingRate)
		}
	}
	return indices
}

const computeCumulativeElevationGainMetres = (input: Position[]): number => {
	let vertGain = 0
	const gainThreshold = 2
	let currentBaseline = input[0][2]

	for (let i = 0; i < input.length; i += 3) {
		const alt = input[i][2]
		const climb = alt - currentBaseline

		if (climb >= gainThreshold) {
			// We have gone up an appreciable amount
			currentBaseline = alt
			vertGain += climb
		} else if (climb <= -gainThreshold) {
			// We have gone down an appreciable amount
			currentBaseline = alt
		}
	}

	return vertGain
}

/**
 * Compute cumulative distances along a path
 * @param input List of coordinate arrays representing a path
 * @returns Array of distances. Each distance is the distance along the path from the start of the path to that point.
 */
const computeCumulutiveDistanceMetres = (input: Position[]): number[] => {
	let distanceMetres = 0
	const distancesMetres = [0]

	for (let i = 1; i < input.length; i++) {
		distanceMetres += haversineDistanceMetres(
			input[i] as [number, number],
			input[i - 1] as [number, number]
		)
		distancesMetres.push(distanceMetres)
	}

	return distancesMetres
}

/**
 * Compute distance along a path
 * @param input Array of coordinate positions representing a path
 * @returns Total distance of path in metres
 */
const computeDistanceMetres = (input: Position[]): number => {
	let distanceMetres = 0
	const sampling = 3

	for (let i = sampling; i < input.length; i += sampling) {
		distanceMetres += haversineDistanceMetres(
			input[i] as [number, number],
			input[i - sampling] as [number, number]
		)
	}

	return distanceMetres
}

const RADIUS_OF_EARTH_IN_M = 6371e3

const toRadian = (angle: number) => (Math.PI / 180) * angle
const distance = (a: number, b: number) => (Math.PI / 180) * (a - b)

/**
 * Use Haversine algorithm to compute distance between two coordinates
 * @param param0 Array of two numbers representing latitude and longitude of coordinate 1
 * @param param1 Array of two numbers representing latitude and longitude of coordinate 2
 * @returns Distance in metres between coordinate 1 and coordinate 2
 */
const haversineDistanceMetres = (
	[lat1, lon1]: [number, number],
	[lat2, lon2]: [number, number]
) => {
	const dLat = distance(lat2, lat1)
	const dLon = distance(lon2, lon1)

	lat1 = toRadian(lat1)
	lat2 = toRadian(lat2)

	// Haversine Formula
	const a =
		Math.pow(Math.sin(dLat / 2), 2) +
		Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2)
	const c = 2 * Math.asin(Math.sqrt(a))

	const finalDistance = RADIUS_OF_EARTH_IN_M * c

	// TODO: Work out why measurements are about 10% too high
	return finalDistance * 0.9 // Adjust by a proportion in the meantime
}
