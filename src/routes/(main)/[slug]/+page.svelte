<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
	import type { Post } from '../../../types/post'
	import { parseISO, format } from 'date-fns'
	import '$lib/styles/highlight.min.css'
	import MapGroup from '$lib/components/MapGroup.svelte'

	export let data: Post
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

	{#if (data.meta.routes?.length ?? 0) > 0}
		{#each data.geo as g}
			<MapGroup geo={g} />
		{/each}
	{/if}
	<hr class="hidden" />
	<div
		class="prose-custom prose prose-zinc prose-quoteless relative max-w-none overflow-x-hidden dark:prose-invert prose-figcaption:mb-5 prose-img:max-w-full"
	>
		{@html data.content}
	</div>
</article>

<Footer />

<style>
	.prose-custom {
		display: contents;
	}

	:global(.prose-custom > *) {
		grid-column-start: prose-start;
		grid-column-end: prose-end;
		margin-top: 0em;
		margin-bottom: 1.25rem;
		overflow: hidden;
	}

	:global(.prose-custom h1),
	:global(.prose-custom h2),
	:global(.prose-custom h3),
	:global(.prose-custom h4) {
		margin-top: 0rem;
		margin-bottom: 0.8rem;
	}

	:global(.prose-custom li) {
		margin-top: 0;
		margin-bottom: 0;
	}

	:global(.prose-custom li > p) {
		margin-top: 0;
		margin-bottom: 1.25rem;
	}

	:global(.prose-custom figcaption::before) {
		display: inline-block;
		content: '↑';
		font-family: 'Inter', system-ui;
		opacity: 0.5;
		margin-right: 0.25rem;
	}

	:global(.prose-custom blockquote p) {
		margin-top: 0;
		margin-bottom: 0;
	}

	:global(.prose-custom pre) {
		padding: 0;
	}

	:global(.prose-custom pre > code) {
		tab-size: 2;
	}

	:global(.prose-custom > figure) {
		display: contents;
	}

	:global(.prose-custom > figure > *) {
		grid-column-start: prose-start;
		grid-column-end: prose-end;
		margin-top: 0rem;
		margin-bottom: 1.25rem;
	}

	:global(.prose-custom img) {
		background-color: #d4d4d8; /* zinc-300 */
		color: transparent;
	}

	@media (prefers-color-scheme: dark) {
		:global(.prose-custom img) {
			background-color: #3f3f46; /* zinc-700 */
		}
	}

	:global(.prose-custom > iframe) {
		width: 100%;
		height: 432px;
	}

	:global(.prose-custom > table) {
		display: block;
		overflow-x: scroll;
	}

	@media only screen and (max-width: 767px) {
		:global(.prose-custom > img),
		:global(.prose-custom > figure > img),
		:global(.prose-custom > iframe) {
			grid-column-start: full-start;
			grid-column-end: full-end;
		}
	}

	:global(.prose-custom .prose-custom-w-full) {
		grid-column-start: full-start;
		grid-column-end: full-end;
		margin-left: auto;
		margin-right: auto;
	}

	:global(.katex-display) {
		overflow-x: auto;
		overflow-y: hidden;
	}
</style>
