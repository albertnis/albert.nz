<script lang="ts">
	import type { ViteGpxPluginOutput } from '../../../plugins/vite-plugin-gpx/types'
	import Map from '$lib/components/Map.svelte'
	import ElevationGraph from '$lib/components/ElevationGraph.svelte'

	export let geo: ViteGpxPluginOutput
	let hoveredIndex: number | undefined = undefined
</script>

<div class="col-start-[image-start] col-end-[image-end] mb-6">
	<ElevationGraph
		bind:hoveredIndex
		cumulativeDistances={geo.cumulativeDistancesMetres}
		geoJson={geo.geoJson}
	/>
	<div class="mb-5 flex justify-end align-bottom text-2xl">
		<div class="mx-3">
			<span class="mx-1 font-bold">{(geo.distanceMetres / 1000).toFixed(1)}</span><span
				class="text-stone-600 dark:text-stone-400">km</span
			>
		</div>
		<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
		<div class="mx-3">
			<span class="mx-1 font-bold">{geo.cumulativeElevationGainMetres?.toLocaleString()}</span><span
				class="text-stone-600 dark:text-stone-400">m</span
			>
		</div>
		<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
		<div class="mx-3">
			<span class="mx-1 font-bold">{geo.duration?.days}</span><span
				class="text-stone-600 dark:text-stone-400">d</span
			><span class="mx-1 font-bold">{geo.duration?.hours}</span><span
				class="text-stone-600 dark:text-stone-400">h</span
			><span class="mx-1 font-bold">{geo.duration?.minutes}</span><span
				class="text-stone-600 dark:text-stone-400">m</span
			>
		</div>
	</div>
	<Map {hoveredIndex} breakIndices={geo.breakIndices} geoJson={geo.geoJson} />
</div>
