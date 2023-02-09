<script lang="ts">
	import type { ViteGpxPluginOutput } from '../../../plugins/vite-plugin-gpx/types'
	import Map from '$lib/components/Map.svelte'
	import ElevationGraph from '$lib/components/ElevationGraph.svelte'
	import DownloadIcon from './DownloadIcon.svelte'

	export let geo: ViteGpxPluginOutput
	let hoveredIndex: number | undefined = undefined
</script>

<div class="col-start-[image-start] col-end-[image-end] mb-6">
	<ElevationGraph
		bind:hoveredIndex
		cumulativeDistances={geo.cumulativeDistancesMetres}
		geoJson={geo.geoJson}
	/>
	<div class="mb-5 flex justify-end align-bottom text-lg lg:text-2xl">
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1">{(geo.distanceMetres / 1000).toFixed(1)}</span><span
				class="text-stone-600 dark:text-stone-400">km</span
			>
		</div>
		<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1">{geo.cumulativeElevationGainMetres?.toLocaleString()}</span
			><span class="text-stone-600 dark:text-stone-400">m</span>
		</div>
		<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1">{geo.duration?.days}</span><span
				class="text-stone-600 dark:text-stone-400">d</span
			><span class="font-bold sm:mx-1">{geo.duration?.hours}</span><span
				class="text-stone-600 dark:text-stone-400">h</span
			><span class="font-bold sm:mx-1">{geo.duration?.minutes}</span><span
				class="text-stone-600 dark:text-stone-400">m</span
			>
		</div>
		<a
			title="Download GPX file"
			class="mx-3 flex items-center text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
			href={geo.gpxFilePath}><DownloadIcon /></a
		>
	</div>
	<Map {hoveredIndex} breakIndices={geo.breakIndices} geoJson={geo.geoJson} />
</div>
