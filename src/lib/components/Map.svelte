<script lang="ts">
	import type { GeoJSON } from 'geojson'
	import { onMount } from 'svelte'
	import mapboxgl, { Map } from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'

	export let geoJson: GeoJSON

	const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'

	let mapDiv: HTMLElement | undefined
	let map: Map

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
			map.addSource('the_id', { type: 'geojson', data: geoJson })
			map.addLayer({
				id: 'the_id',
				type: 'line',
				source: 'the_id',
				layout: {
					'line-join': 'round',

					'line-cap': 'round'
				},
				paint: {
					'line-color': '#F00',
					'line-width': 5
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
