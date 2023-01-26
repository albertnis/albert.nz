<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
	import type { Post } from '../../types/post'
	import { parseISO, format } from 'date-fns'
	import Map from '$lib/components/Map.svelte'
	import ElevationGraph from '$lib/components/ElevationGraph.svelte'

	export let data: Post
	console.log({ datadotgeo: data.geo })
</script>

<HeaderSmall />

<article class="contents">
	<div class="col-start-[wide-start] col-end-[wide-end]">
		<h1 class="mb-5 text-5xl font-bold md:text-7xl">{data.meta.title}</h1>
		<div class="mb-12 font-bold text-stone-600 dark:text-stone-400">
			{format(parseISO(data.meta.date), 'MMMM d, yyyy')}
		</div>
	</div>
	{#each data.geo as g}
		<div class="col-start-[image-start] col-end-[image-end] mb-6">
			<ElevationGraph cumulativeDistances={g.cumulativeDistancesMetres} geoJson={g.geoJson} />
			<div class="mb-5 flex justify-end align-bottom text-2xl">
				<div class="mx-3">
					<span class="mx-1 font-bold">{(g.distanceMetres / 1000).toFixed(1)}</span><span
						class="text-stone-600 dark:text-stone-400">km</span
					>
				</div>
				<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
				<div class="mx-3">
					<span class="mx-1 font-bold">{g.cumulativeElevationGainMetres?.toLocaleString()}</span
					><span class="text-stone-600 dark:text-stone-400">m</span>
				</div>
				<div class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</div>
				<div class="mx-3">
					<span class="mx-1 font-bold">{g.duration?.days}</span><span
						class="text-stone-600 dark:text-stone-400">d</span
					><span class="mx-1 font-bold">{g.duration?.hours}</span><span
						class="text-stone-600 dark:text-stone-400">h</span
					><span class="mx-1 font-bold">{g.duration?.minutes}</span><span
						class="text-stone-600 dark:text-stone-400">m</span
					>
				</div>
			</div>
			<Map geoJson={g.geoJson} />
		</div>
	{/each}
	<div
		class="prose-railed prose prose-stone prose-quoteless col-start-2 col-end-3 max-w-none prose-figcaption:mb-5 prose-img:w-screen dark:prose-invert lg:col-start-3 lg:col-end-4"
	>
		<svelte:component this={data.content} />
	</div>
</article>

<Footer />
