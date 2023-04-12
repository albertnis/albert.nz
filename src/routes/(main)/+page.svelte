<script lang="ts">
	import { format, parseISO } from 'date-fns'
	import type { PostPreview } from '../../types/post'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Tag from '$lib/components/Tag.svelte'
	import TagSmall from '$lib/components/TagSmall.svelte'
	import MapIcon from '$lib/components/MapIcon.svelte'
	export let data: { posts: PostPreview[] }

	let showTechnologyTag = true
	let showAdventuresTag = true
</script>

<svelte:head>
	<meta property="og:type" content="profile" />
	<meta property="profile:first_name" content="Albert" />
	<meta property="profile:last_name" content="Nisbet" />
	<meta property="profile:username" content="albertnis" />
</svelte:head>

<Header />

<div class="col-start-[wide-start] col-end-[wide-end]">
	<h2 class="text-2xl" id="posts">
		<span class="font-bold">Latest posts</span>
		<span class="text-zinc-600 dark:text-zinc-400">about</span>
		<Tag tag="technology" bind:enabled={showTechnologyTag} />
		<span class="text-zinc-600 dark:text-zinc-400">and</span>
		<Tag tag="adventures" bind:enabled={showAdventuresTag} />
	</h2>

	{#if showAdventuresTag}
		<div
			class="my-8 rounded-md border border-teal-800 bg-teal-600 p-2 text-zinc-50 dark:border-teal-400 sm:w-[300px]"
		>
			<a class="group inline-block w-full" href="/adventures">
				<div class="flex items-center font-bold">
					<MapIcon />
					<div>
						<span class="ml-2 border-b border-b-zinc-50 group-hover:border-b-2">Adventures map</span
						>
					</div>
				</div>
				<div class="text-sm text-teal-200">View adventures on an interactive map</div>
			</a>
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
