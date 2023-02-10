declare module '@mapbox/togeojson' {
	import type { GeoJSON } from 'geojson'

	interface MapboxToGeoJson {
		gpx: (data: Document) => GeoJSON
	}

	const mapboxToGeoJson: MapboxToGeoJson

	export = mapboxToGeoJson
}
