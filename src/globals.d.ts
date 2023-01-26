import type { GeoJSON } from 'geojson'

declare module '*.gpx' {
	export const geojson: GeoJSON
	export const metadata: GeoMetadata
}
