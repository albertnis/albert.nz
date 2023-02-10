<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
	import type { Post } from '../../types/post'
	import { parseISO, format } from 'date-fns'
	import { onMount } from 'svelte'
	import type { ComponentType, SvelteComponentTyped } from 'svelte'
	import '$lib/styles/prism.min.css'
	import type { ViteGpxPluginOutput } from '../../../plugins/vite-plugin-gpx/types'

	export let data: Post
	let mapGroupComponent: ComponentType<SvelteComponentTyped> | undefined
	let geo: ViteGpxPluginOutput[] = []

	onMount(async () => {
		geo = await data.getGeo()

		if (geo.length > 0) {
			mapGroupComponent = (await import('$lib/components/MapGroup.svelte')).default
		}
	})
</script>

<svelte:head>
	<meta property="og:type" content="article" />
	<meta property="article:published_time" content={data.meta.date} />
	<meta property="article:author" content="Albert Nisbet" />
</svelte:head>

<HeaderSmall />

<article class="contents">
	<div class="col-start-[wide-start] col-end-[wide-end]">
		<h1 class="mb-5 text-5xl font-bold md:text-7xl">{data.meta.title}</h1>
		<div class="mb-12 font-bold text-zinc-600 dark:text-zinc-400">
			{format(parseISO(data.meta.date), 'MMMM d, yyyy')}
		</div>
	</div>

	{#if mapGroupComponent != null}
		{#each geo as g}
			<svelte:component this={mapGroupComponent} geo={g} />
		{/each}
	{/if}
	<div
		class="prose prose-zinc prose-quoteless relative col-start-[prose-start] col-end-[prose-end] max-w-none overflow-x-hidden prose-figcaption:mb-5 prose-img:max-w-full dark:prose-invert"
	>
		<svelte:component this={data.content} />
	</div>
</article>

<Footer />
