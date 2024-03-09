<script lang="ts">
	import { onMount } from 'svelte'
	import mapboxgl, { Map, Marker } from 'mapbox-gl'
	import 'mapbox-gl/dist/mapbox-gl.css'
	import type { PostMapPreview } from '../../types/post'

	export let postMapPreviews: PostMapPreview[]

	let mapDiv: HTMLElement | undefined
	let map: Map

	export let selectedGpxPath: string | null = null
	export let selectedPostPath: string | null = null

	let selectedGpxPathInternal: string | null = null
	$: {
		if (selectedGpxPathInternal != null) {
			// Mark previously selected path as unselected
			map.setPaintProperty(selectedGpxPathInternal + '_layer_path', 'line-color', '#f97316')
		}
		if (selectedGpxPath == null) {
			selectedPostPath = null
		} else {
			// Mark newly selected path as selected
			map.setPaintProperty(selectedGpxPath + '_layer_path', 'line-color', '#0ea5e9')
		}
		selectedGpxPathInternal = selectedGpxPath
	}

	const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'
	const lightMapStyle = 'mapbox://styles/albertnis/ckqu3o4rn6np917qz18x1whbz'

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
			style: mapStyle,
			center: [172.82, -40.74],
			zoom: 5
		})
		map.on('load', () => {})
		map.on('style.load', () => {
			postMapPreviews.forEach((p) => {
				p.geo.forEach((g) => {
					let geoJson = g.pathData.geoJson
					let coords =
						geoJson.type === 'LineString' && geoJson.coordinates[0].length >= 2
							? geoJson.coordinates
							: []

					map.addSource(g.metadata.gpxFilePath + '_source_path', { type: 'geojson', data: geoJson })
					map.addLayer({
						id: g.metadata.gpxFilePath + '_layer_path',
						type: 'line',
						source: g.metadata.gpxFilePath + '_source_path',
						layout: {
							'line-join': 'round',
							'line-cap': 'round'
						},
						paint: {
							'line-color': '#f97316',
							'line-width': 5
						}
					})

					const marker = new Marker({ color: '#0ea5e9', scale: 0.75 })
						.setLngLat([coords[0][0], coords[0][1]])
						.addTo(map)
					const markerEl = marker.getElement()

					const onClick = () => {
						const coordns = coords as [number, number][]
						const bounds = coordns.reduce(
							(bounds, coord) => bounds.extend(coord),
							new mapboxgl.LngLatBounds(coordns[0], coordns[0])
						)
						map.fitBounds(bounds, {
							padding: { top: 40, right: 40, bottom: 200, left: 40 }
						})
						selectedGpxPath = g.metadata.gpxFilePath
						selectedPostPath = p.path
					}
					const onMouseEnter = () => {
						map.getCanvas().style.cursor = 'pointer'
					}
					const onMouseLeave = () => {
						map.getCanvas().style.cursor = ''
					}

					markerEl.addEventListener('click', onClick)
					map.on('click', g.metadata.gpxFilePath + '_layer_path', onClick)
					map.on('mouseenter', g.metadata.gpxFilePath + '_layer_path', onMouseEnter)
					map.on('mouseleave', g.metadata.gpxFilePath + '_layer_path', onMouseLeave)
				})
			})
		})
	})
</script>

<div class="absolute-important bottom-0 left-0 h-full w-full map-fullscreen" bind:this={mapDiv} />

<style>
	.absolute-important {
		position: absolute !important;
	}

	:global(.map-fullscreen .mapboxgl-marker) {
		cursor: pointer;
	}
</style>
