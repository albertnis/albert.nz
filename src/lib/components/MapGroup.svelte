<script lang="ts">
	import type { ViteGpxPluginOutput } from '../../../plugins/vite-plugin-gpx/types'
	import type { ComponentType, SvelteComponentTyped } from 'svelte'
	import { onMount } from 'svelte'
	import ElevationGraph from '$lib/components/ElevationGraph.svelte'
	import DownloadIcon from './DownloadIcon.svelte'
	import MapLoading from './MapLoading.svelte'

	export let geo: ViteGpxPluginOutput
	let hoveredIndex: number | undefined = undefined
	let mapComponent: ComponentType<SvelteComponentTyped> | undefined

	onMount(async () => {
		mapComponent = (await import('$lib/components/Map.svelte')).default
	})
</script>

<svelte:head>
	<noscript>
		<style>
			.maploading {
				display: none;
			}
		</style>
	</noscript>
</svelte:head>

<div class="col-start-[image-start] col-end-[image-end] mb-6">
	<ElevationGraph
		bind:hoveredIndex
		cumulativeDistances={geo.pathData.cumulativeDistancesMetres}
		pathSamplingPeriod={geo.pathData.samplingPeriod}
		elevationSamplingPeriod={geo.elevationData.samplingPeriod}
		elevations={geo.elevationData.downSampledElevations}
	/>
	<div class="mb-5 flex justify-end align-bottom text-lg lg:text-2xl">
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1">{(geo.metadata.distanceMetres / 1000).toFixed(1)}</span><span
				class="text-zinc-600 dark:text-zinc-400">km</span
			>
		</div>
		<div class="text-zinc-600 dark:text-zinc-400">&nbsp;/&nbsp;</div>
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1"
				>{geo.elevationData.elevationGainMetres?.toLocaleString()}</span
			><span class="text-zinc-600 dark:text-zinc-400">m</span>
		</div>
		<div class="text-zinc-600 dark:text-zinc-400">&nbsp;/&nbsp;</div>
		<div class="md:mx-3">
			<span class="font-bold sm:mx-1">{geo.metadata.duration?.days}</span><span
				class="text-zinc-600 dark:text-zinc-400">d</span
			><span class="font-bold sm:mx-1">{geo.metadata.duration?.hours}</span><span
				class="text-zinc-600 dark:text-zinc-400">h</span
			><span class="font-bold sm:mx-1">{geo.metadata.duration?.minutes}</span><span
				class="text-zinc-600 dark:text-zinc-400">m</span
			>
		</div>
		<a
			title="Download GPX file"
			class="mx-3 flex items-center text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
			href={geo.metadata.gpxFilePath}><DownloadIcon /></a
		>
	</div>
</div>
{#if mapComponent == null}
	<div class="maploading col-start-[prose-start] col-end-[prose-end] mb-6">
		<MapLoading />
	</div>
{:else}
	<div class="col-start-[image-start] col-end-[image-end] mb-6">
		<svelte:component
			this={mapComponent}
			hoveredIndex={hoveredIndex &&
				Math.floor(hoveredIndex * (geo.elevationData.samplingPeriod / geo.pathData.samplingPeriod))}
			breakIndices={geo.metadata.breakIndices}
			pathData={geo.pathData}
		/>
	</div>
{/if}
