<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
	import type { Post } from '../../types/post'
	import { parseISO, format } from 'date-fns'

	export let data: Post
</script>

<HeaderSmall />

<article class="contents">
	<div class="col-start-[wide-start] col-end-[wide-end]">
		<h1 class="mb-5 text-5xl font-bold md:text-7xl">{data.meta.title}</h1>
		<div class="mb-16 font-bold text-stone-600 dark:text-stone-400">
			{format(parseISO(data.meta.date), 'MMMM d, yyyy')}
		</div>
	</div>
	<div
		class="prose-railed prose prose-stone prose-quoteless col-start-2 col-end-3 max-w-none prose-figcaption:mb-5 prose-img:w-screen dark:prose-invert lg:col-start-3 lg:col-end-4"
	>
		<svelte:component this={data.content} />
	</div>
</article>

<Footer />
