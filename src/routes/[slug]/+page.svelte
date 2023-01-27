<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
	import type { Post } from '../../types/post'
	import { parseISO, format } from 'date-fns'
	import MapGroup from '$lib/components/MapGroup.svelte'

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
		<MapGroup geo={g} />
	{/each}
	<div
		class="prose-railed prose prose-stone prose-quoteless col-start-[prose-start] col-end-[prose-end] max-w-none prose-figcaption:mb-5 prose-img:w-screen dark:prose-invert"
	>
		<svelte:component this={data.content} />
	</div>
</article>

<Footer />
