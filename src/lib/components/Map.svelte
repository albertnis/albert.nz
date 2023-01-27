<script lang="ts">
	import type { GeoJSON } from 'geojson'
	import { onMount } from 'svelte'
	import mapboxgl, { GeoJSONSource, Map } from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'
	import MapGroup from './MapGroup.svelte'

	export let geoJson: GeoJSON
	export let breakIndices: number[]
	export let hoveredIndex: number | undefined

	let coords =
		geoJson.type === 'FeatureCollection' &&
		geoJson.features[0].geometry.type === 'LineString' &&
		geoJson.features[0].geometry.coordinates[0].length === 3
			? geoJson.features[0].geometry.coordinates
			: []

	const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'

	let mapDiv: HTMLElement | undefined
	let map: Map

	$: if (map?.loaded()) {
		const source = map.getSource('the_hoveredPoint') as GeoJSONSource
		source.setData({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'MultiPoint',
						coordinates: hoveredIndex == null ? [] : [coords[hoveredIndex]]
					}
				}
			]
		})
	}

	onMount(() => {
		if (mapDiv == null) {
			throw new TypeError('Map div is undefined')
		}

		mapboxgl.accessToken =
			'pk.eyJ1IjoiYWxiZXJ0bmlzIiwiYSI6ImNrcXUwNHlhcTJnODAydm84anEzanIwZHQifQ.B9-IeJHvH9nnfQT9QT4ouw'
		map = new mapboxgl.Map({
			container: mapDiv,
			style: darkMapStyle,
			center: [172.82, -40.74],
			zoom: 5
		})
		map.on('load', () => {
			console.log({ geoJson })

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
					'line-color': '#0CF',
					'line-width': 5
				}
			})
			map.addSource('the_break', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'MultiPoint',
								coordinates: breakIndices?.map((b) => coords[b]) ?? []
							}
						}
					]
				}
			})
			map.addLayer({
				id: 'the_break_layer',
				type: 'circle',
				source: 'the_break',
				paint: {
					'circle-radius': 10,
					'circle-color': '#FB1'
				}
			})
			map.addSource('the_hoveredPoint', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {},
							geometry: { type: 'MultiPoint', coordinates: [] }
						}
					]
				}
			})
			map.addLayer({
				id: 'the_hoveredPoint_layer',
				type: 'circle',
				source: 'the_hoveredPoint',
				paint: {
					'circle-radius': 10,
					'circle-color': '#FFF'
				}
			})
			map.addSource('the_end', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {},
							geometry: { type: 'Point', coordinates: coords[coords.length - 1] }
						}
					]
				}
			})
			map.addLayer({
				id: 'the_end_layer',
				type: 'circle',
				source: 'the_end',
				paint: {
					'circle-radius': 10,
					'circle-color': '#F33'
				}
			})
			map.addSource('the_start', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: coords[0] } }
					]
				}
			})
			map.addLayer({
				id: 'the_start_layer',
				type: 'circle',
				source: 'the_start',
				paint: {
					'circle-radius': 10,
					'circle-color': '#5F5'
				}
			})

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
					padding: { top: 30, right: 30, bottom: 30, left: 30 }
				})
			}
		})
	})
</script>

<div>
	<div class="min-h-[800px]" bind:this={mapDiv} />
</div>
