<script lang="ts">
	import type { GeoJSON } from 'geojson'
	import { onMount } from 'svelte'
	import mapboxgl, { Map } from 'mapbox-gl'
	import { type Marker as MarkerType, Marker } from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'
	import type { GeoPathData } from '../../../plugins/vite-plugin-gpx/types'

	export let pathData: GeoPathData
	export let breakIndices: number[]
	export let hoveredIndex: number | undefined

	let downSampledBreakIndices = breakIndices.map((i) => Math.floor(i / pathData.samplingPeriod))

	let geoJson = pathData.geoJson
	let coords =
		geoJson.type === 'FeatureCollection' &&
		geoJson.features[0].geometry.type === 'LineString' &&
		geoJson.features[0].geometry.coordinates[0].length >= 2
			? geoJson.features[0].geometry.coordinates
			: []

	let mapDiv: HTMLElement | undefined
	let map: Map
	let hoveredMarker: MarkerType | undefined

	const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'
	const lightMapStyle = 'mapbox://styles/albertnis/ckqu3o4rn6np917qz18x1whbz'

	$: {
		// Combining the following two if statements with `&&` breaks reactivity in prod...
		if (hoveredMarker != null) {
			if (map?.loaded()) {
				if (hoveredIndex != null) {
					const cod = coords[hoveredIndex]
					hoveredMarker.setLngLat([cod[0], cod[1]]).addTo(map)
				} else {
					hoveredMarker.remove()
				}
			}
		}
	}

	onMount(() => {
		if (mapDiv == null) {
			throw new TypeError('Map div is undefined')
		}

		const mapStyle = window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkMapStyle
			: lightMapStyle

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			const newMapStyle = e.matches ? darkMapStyle : lightMapStyle
			if (map?.loaded()) {
				map.setStyle(newMapStyle)
			}
		})

		mapboxgl.accessToken =
			'pk.eyJ1IjoiYWxiZXJ0bmlzIiwiYSI6ImNrcXUwNHlhcTJnODAydm84anEzanIwZHQifQ.B9-IeJHvH9nnfQT9QT4ouw'
		map = new mapboxgl.Map({
			container: mapDiv,
			cooperativeGestures: true,
			style: mapStyle,
			center: [172.82, -40.74],
			zoom: 5
		})
		map.on('load', () => {
			downSampledBreakIndices?.forEach((b) => {
				const breakCoords = coords[b]
				new Marker({ color: '#FB1' }).setLngLat([breakCoords[0], breakCoords[1]]).addTo(map)
			})

			const endCoords = coords[coords.length - 1]
			new Marker({ color: '#F33' }).setLngLat([endCoords[0], endCoords[1]]).addTo(map)

			hoveredMarker = new Marker({ color: '#FFF' })

			const startCoords = coords[0]
			new Marker({ color: '#22c55e' }).setLngLat([startCoords[0], startCoords[1]]).addTo(map)

			if (
				geoJson.type === 'FeatureCollection' &&
				geoJson.features[0].geometry.type === 'LineString'
			) {
				const coords = geoJson.features[0].geometry.coordinates as [number, number][]
				const bounds = coords.reduce(
					(bounds, coord) => bounds.extend(coord),
					new mapboxgl.LngLatBounds(coords[0], coords[0])
				)
				map.fitBounds(bounds, {
					padding: { top: 40, right: 40, bottom: 40, left: 40 }
				})
			}
		})
		map.on('style.load', () => {
			map.addSource('the_path', { type: 'geojson', data: geoJson })
			map.addLayer({
				id: 'the_path_layer',
				type: 'line',
				source: 'the_path',
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#0ea5e9',
					'line-width': 5
				}
			})
		})
	})
</script>

<div>
	<div class="h-[500px] max-h-[82vh] sm:h-[600px] md:h-[700px]" bind:this={mapDiv} />
</div>
