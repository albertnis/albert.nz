import { basename } from 'node:path'
import { readFile } from 'node:fs/promises'

import geojson from '@mapbox/togeojson'
import type { Geometry, Position } from 'geojson'
import type { Plugin } from 'vite'
import { DOMParser } from 'xmldom'

import { computeBreakIndices } from './computeBreakIndices'
import { computeCumulativeElevationGainMetres } from './computeCumulativeElevationGainMetres'
import { computeDuration } from './computeDuration'
import { computeStartTime } from './computeStartTime'
import { downSampleArray } from './downSampleArray'
import { haversineDistanceMetres } from './haversineDistanceMetres'
import type { ViteGpxPluginOutput } from './types'

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

	return {
		elevationData: {
			downSampledElevations,
			elevationGainMetres:
				feature.geometry.coordinates[0].length === 3
					? computeCumulativeElevationGainMetres(1)(feature.geometry.coordinates.map((c) => c[2]))
					: null,
			samplingPeriod: elevationSamplingPeriod
		},
		metadata: {
			gpxFilePath: path,
			breakIndices: computeBreakIndices(30)(feature),
			duration: computeDuration(feature),
			startTime: computeStartTime(feature),
			distanceMetres
		},
		pathData: {
			geoJson: downSampledGeometry,
			cumulativeDistancesMetres,
			samplingPeriod: pathSamplingPeriod
		}
	}
}

/**
 * Compute cumulative distances along a path
 * @param input List of coordinate arrays representing a path
 * @returns Array of distances. Each distance is the distance along the path from the start of the path to that point.
 */
const computeCumulutiveDistanceMetres = (input: Position[]): number[] => {
	let distanceMetres = 0
	const distancesMetres = [0]

	// Account for overestimation due to zig-zagging path
	const distanceCorrectionFactor = 0.9

	for (let i = 1; i < input.length; i++) {
		distanceMetres += haversineDistanceMetres(
			input[i] as [number, number],
			input[i - 1] as [number, number]
		)
		distancesMetres.push(distanceMetres * distanceCorrectionFactor)
	}

	return distancesMetres
}
