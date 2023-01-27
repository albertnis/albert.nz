import type { FeatureCollection, GeoJSON } from 'geojson'
import type { Duration } from 'date-fns'

export interface ViteGpxPluginOptions {
	samplingRate: number
}

export interface ViteGpxPluginOutput {
	geoJson: FeatureCollection
	duration: Duration | null
	startTime: Date | null
	distanceMetres: number
	cumulativeElevationGainMetres: number | null
	cumulativeDistancesMetres: number[]
	breakIndices: number[]
}
