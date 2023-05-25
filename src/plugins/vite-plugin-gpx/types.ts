import type { FeatureCollection, GeoJSON } from 'geojson'
import type { Duration } from 'date-fns'

export interface ViteGpxPluginOptions {
	samplingRate: number
}

export interface ViteGpxPluginOutput {
	elevationData: GeoElevationData
	pathData: GeoPathData
	metadata: GeoMetadata
}

export interface GeoElevationData {
	elevationGainMetres: number | null
	samplingPeriod: number
	downSampledElevations: number[]
}

export interface GeoPathData {
	geoJson: GeoJSON
	samplingPeriod: number
	cumulativeDistancesMetres: number[]
}

export interface GeoMetadata {
	breakIndices: number[]
	gpxFilePath: string
	duration: Duration | null
	startTime: Date | null
	distanceMetres: number
}
