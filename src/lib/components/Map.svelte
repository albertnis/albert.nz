<script lang="ts">
	import type { GeoJSON } from 'geojson'
	import { onMount } from 'svelte'
	import mapboxgl, { Map } from 'mapbox-gl'
	import { type Marker as MarkerType, Marker } from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'

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
	let hoveredMarker: MarkerType | undefined

	$: if (map?.loaded() && hoveredMarker != null) {
		if (hoveredIndex != null) {
			const cod = coords[hoveredIndex]
			hoveredMarker.setLngLat([cod[0], cod[1]])
			hoveredMarker.addTo(map)
		} else {
			hoveredMarker.remove()
		}
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

			breakIndices?.forEach((b) => {
				const breakCoords = coords[b]
				new Marker({ color: '#FB1' }).setLngLat([breakCoords[0], breakCoords[1]]).addTo(map)
			})

			hoveredMarker = new Marker({ color: '#FFF' })

			const endCoords = coords[coords.length - 1]
			new Marker({ color: '#F33' }).setLngLat([endCoords[0], endCoords[1]]).addTo(map)

			const startCoords = coords[0]
			new Marker({ color: '#5F5' }).setLngLat([startCoords[0], startCoords[1]]).addTo(map)

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
	})
</script>

<div>
	<div class="min-h-[800px]" bind:this={mapDiv} />
</div>
