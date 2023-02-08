import type { Plugin } from 'vite'
import type { ViteGpxPluginOptions, ViteGpxPluginOutput } from './types'
import geojson from '@mapbox/togeojson'
import type { Feature, FeatureCollection, GeoJSON, Geometry, Position } from 'geojson'
import { DOMParser } from 'xmldom'
import {
	differenceInHours,
	differenceInMilliseconds,
	differenceInMinutes,
	intervalToDuration,
	parseISO
} from 'date-fns'
import { LTTB } from 'downsample'
import type { TupleDataPoint } from 'downsample'

const defaultOptions: ViteGpxPluginOptions = {
	samplingRate: 1
}

export const gpxPlugin = (options: Partial<ViteGpxPluginOptions>): Plugin => ({
	name: 'vite-plugin-gpx',
	transform: (src, id) => {
		if (/\.gpx$/.test(id)) {
			return {
				code: `export default ${JSON.stringify(gpxDataToOutput(src))}`
			}
		}
	}
})

const gpxDataToOutput = (gpxData: string): ViteGpxPluginOutput => {
	const gpxXmlDocument = new DOMParser().parseFromString(gpxData)
	const gj: GeoJSON = geojson.gpx(gpxXmlDocument)

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

	const downSampledCoordinates = downSampleGeometry(feature.geometry.coordinates, 15)
	const downSampledGeometry: Geometry = { ...feature.geometry, coordinates: downSampledCoordinates }

	return {
		duration: computeDuration(feature),
		startTime: computeStartTime(feature),
		geoJson: buildGeoJSONFromGeometry(downSampledGeometry),
		distanceMetres: computeDistanceMetres(feature.geometry.coordinates),
		cumulativeElevationGainMetres:
			feature.geometry.coordinates[0].length === 3
				? computeCumulativeElevationGainMetres(feature.geometry.coordinates)
				: null,
		cumulativeDistancesMetres: computeCumulutiveDistanceMetres(downSampledCoordinates),
		breakIndices: computeBreakIndices(feature)
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

const downSampleGeometry = (coordinates: Position[], factor: number): Position[] => {
	if (factor < 1 || factor % 1 != 0) {
		throw new TypeError('Factor must be an integer greater than or equal to 1')
	}

	const coordinatesIn: Position[] = coordinates
	const coordinatesOut: Position[] = []

	for (let i = 0; i < coordinates.length; i += factor) {
		coordinatesOut.push(coordinatesIn[i])
	}

	return coordinatesOut
}

const computeDuration = (input: Feature): Duration | null => {
	const times = input.properties?.coordTimes
	if (times == null || !Array.isArray(times)) {
		return null
	}

	const start = parseISO(times[0])
	const end = parseISO(times[times.length - 1])

	return intervalToDuration({ start, end })
}

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

const computeBreakIndices = (input: Feature): number[] => {
	const times = input.properties?.coordTimes

	if (!Array.isArray(times)) {
		return []
	}

	const parsedTimes = times.filter((_, i) => i % 9 === 0).map((t) => parseISO(t))

	const indices = []
	for (let i = 1; i < parsedTimes.length; i++) {
		if (differenceInHours(parsedTimes[i], parsedTimes[i - 1]) > 4) {
			indices.push(i)
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
