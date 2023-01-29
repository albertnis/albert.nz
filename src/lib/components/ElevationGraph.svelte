<script lang="ts">
	import type { GeoJSON } from 'geojson'
	import { onMount } from 'svelte'

	export let geoJson: GeoJSON
	export let cumulativeDistances: number[]

	const xBasis = 3000

	let totalDistance = cumulativeDistances[cumulativeDistances.length - 1]
	let distanceScalingFactor = xBasis / totalDistance

	let elevations =
		geoJson.type === 'FeatureCollection' &&
		geoJson.features[0].geometry.type === 'LineString' &&
		geoJson.features[0].geometry.coordinates[0].length === 3
			? geoJson.features[0].geometry.coordinates.map((c) => c[2])
			: []

	let maxElevation = elevations.reduce((max, e) => (e > max ? e : max), elevations[0])
	let minElevation = elevations.reduce((min, e) => (e < min ? e : min), elevations[0])

	let svg: SVGGraphicsElement
	let svgX = 0
	let svgY = 0
	export let hoveredIndex: number | undefined

	function handleTouchmove(e: TouchEvent) {
		handleMove(e.touches[0].clientX, e.touches[0].clientY)
	}

	function handleMousemove(e: MouseEvent) {
		handleMove(e.clientX, e.clientY)
	}

	function handleMove(x: number, y: number) {
		const pt = new DOMPointReadOnly(x, y).matrixTransform(svg.getScreenCTM().inverse())
		svgX = pt.x
		svgY = pt.y

		if (svgX > 0 && svgX < xBasis) {
			const hoveredDistance = (totalDistance * svgX) / xBasis
			let i
			for (i = 0; i < cumulativeDistances.length - 2; i += 2) {
				if (cumulativeDistances[i] > hoveredDistance) {
					break
				}
			}
			hoveredIndex = i
		} else {
			hoveredIndex = undefined
		}
	}

	function handleMouseleave() {
		hoveredIndex = undefined
	}
</script>

{#if elevations.length > 1}
	<svg
		class="overflow-visible"
		bind:this={svg}
		on:mousemove={handleMousemove}
		on:touchmove={handleTouchmove}
		on:touchstart={handleTouchmove}
		on:touchend={handleMouseleave}
		on:mouseleave={handleMouseleave}
		viewBox={`-30 -30 ${xBasis + 60} ${maxElevation - minElevation + 90}`}
	>
		<polyline
			stroke-linejoin="round"
			stroke-linecap="round"
			class="fill-none stroke-stone-800 stroke-[20] dark:stroke-stone-200 md:stroke-[10]"
			points={elevations.reduce(
				(str, alt, i) =>
					str + `${cumulativeDistances[i] * distanceScalingFactor},${maxElevation - alt} `,
				''
			)}
		/>
		{#if hoveredIndex != null}
			<line
				class="fill-none stroke-stone-800 stroke-[3] dark:stroke-stone-200"
				x1={svgX}
				y1={maxElevation - minElevation}
				x2={svgX}
				y2={maxElevation - elevations[hoveredIndex]}
			/>
			<line
				class="fill-none stroke-stone-300 stroke-[3] dark:stroke-stone-700"
				x1={svgX}
				y1={0}
				x2={svgX}
				y2={maxElevation - elevations[hoveredIndex]}
				fill="#F00"
			/>
			<text
				x={svgX}
				y={maxElevation - elevations[hoveredIndex]}
				stroke-width="10"
				paint-order="stroke"
				class="cursor-default fill-stone-800 stroke-stone-200 text-[100px] font-bold dark:fill-stone-200 dark:stroke-stone-800 md:text-[50px]"
				dominant-baseline="middle"
				text-anchor="middle">{Math.round(elevations[hoveredIndex]).toLocaleString()}m</text
			>
			<text
				x={svgX}
				y={maxElevation - minElevation + 30}
				stroke-width="10"
				paint-order="stroke"
				class="cursor-default fill-stone-800 stroke-stone-200 text-[100px] dark:fill-stone-200 dark:stroke-stone-800 md:text-[50px]"
				dominant-baseline="middle"
				font-size="50"
				text-anchor="middle">{(cumulativeDistances[hoveredIndex] / 1000).toFixed(2)}km</text
			>
		{/if}
	</svg>
{/if}
