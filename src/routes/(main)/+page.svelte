<script lang="ts">
	import type { PageData, LayoutServerData } from './$types'
	import { format, parseISO } from 'date-fns'
	import type { PostPreview } from '../../types/post'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Tag from '$lib/components/Tag.svelte'
	import TagSmall from '$lib/components/TagSmall.svelte'
	import MapIcon from '$lib/components/MapIcon.svelte'
	import CameraIcon from '$lib/components/CameraIcon.svelte'
	export let data: PageData

	let showTechnologyTag = true
	let showAdventuresTag = true
</script>

<svelte:head>
	<meta property="og:type" content="profile" />
	<meta property="profile:first_name" content="Albert" />
	<meta property="profile:last_name" content="Nisbet" />
	<meta property="profile:username" content="albertnis" />
</svelte:head>

<Header country={data.country} />

<div class="col-start-[wide-start] col-end-[wide-end]">
	<h2 class="text-2xl" id="posts">
		<span class="font-bold">Latest posts</span>
	</h2>

	<p class="mt-4 mb-8 text-base sm:text-lg">
		I blog about things that are interesting to me: these days that's largely home automation,
		electronics and tramping in New Zealand.
	</p>

	<div class="my-4">
		<span class="text-zinc-700 dark:text-zinc-300 text-base">Tags</span>
		<ul class="inline ml-2">
			<li class="inline text-xl"><Tag tag="technology" bind:enabled={showTechnologyTag} /></li>
			<li class="inline text-xl"><Tag tag="adventures" bind:enabled={showAdventuresTag} /></li>
		</ul>
	</div>

	{#if showAdventuresTag}
		<div class="my-4 flex flex-col sm:flex-row items-baseline gap-1 sm:gap-3">
			<span class="text-zinc-700 dark:text-zinc-300 text-base">View all adventures</span>
			<ul class="inline text-base">
				<li class="inline">
					<a
						class="group inline-block dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-950 bg-zinc-300 hover:bg-zinc-400 active:bg-zinc-50 rounded-md py-2 px-3"
						href="/adventures"
					>
						<div class="flex items-center font-bold">
							<MapIcon />
							<span class="ml-2">Map</span>
						</div>
					</a>
				</li>
				<li class="inline">
					<a
						class="group inline-block dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-950 bg-zinc-300 hover:bg-zinc-400 active:bg-zinc-50 rounded-md py-2 px-3"
						href="/gallery"
					>
						<div class="flex items-center font-bold">
							<CameraIcon />
							<span class="ml-2">Gallery</span>
						</div>
					</a>
				</li>
			</ul>
		</div>
	{/if}

	<ul class="col-start-2 col-end-5 mt-10">
		{#each data.posts.filter((p) => (p.meta.tags.includes('technology') && showTechnologyTag) || (p.meta.tags.includes('adventures') && showAdventuresTag)) as post}
			<li class="my-8">
				<a class="group inline-block" href={post.path}>
					<h3
						class="inline border-b border-b-zinc-600 font-bold group-hover:border-b-2 group-hover:border-b-sky-600 dark:border-b-zinc-400 dark:group-hover:border-b-sky-400"
					>
						{post.meta.title}
					</h3>
					<span class="font-bold text-zinc-600 before:mx-2 before:content-['/'] dark:text-zinc-400">
						{format(parseISO(post.meta.date), 'MMMM d, yyyy')}
					</span>
					{#if post.meta.tags.includes('technology')}
						<TagSmall tag="technology" />
					{/if}
					{#if post.meta.tags.includes('adventures')}
						<TagSmall tag="adventures" />
					{/if}
					<div class="prose prose-zinc max-w-none">
						<p class="text-base text-zinc-700 dark:text-zinc-300">{post.meta.description}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<Footer />
