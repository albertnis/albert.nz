<script lang="ts">
	import Logo from '$lib/components/Logo.svelte'
	import MapFullScreen from '$lib/components/MapFullScreen.svelte'
	import { format, parseISO } from 'date-fns'
	import type { PageData } from './$types'
	import CloseIcon from '$lib/components/CloseIcon.svelte'

	export let data: PageData

	let selectedGpxPath: string | null = null
	let selectedPostPath: string | null = null

	$: selectedPost = selectedPostPath && data.posts.find((p) => p.path === selectedPostPath)
</script>

<div
	class="fixed left-5 top-5 z-10 text-xl bg-zinc-200 dark:bg-zinc-800 bg-opacity-50 flex rounded-md backdrop-blur-md items-center justify-between p-[1rem] sm:justify-start sm:p-4 shadow-md"
>
	<a
		class="pointer-events-auto flex opacity-50 hover:opacity-100 dark:text-zinc-200 text-zinc-800 relative bottom-[0.05em]"
		href="/"
		aria-label="Home page"><Logo /></a
	>

	<div class="ml-2 border-zinc-400 align-middle leading-none font-bold">Adventures</div>
</div>

{#if selectedPost != null && selectedPost != ''}
	<div
		class="pointer-events-none fixed bottom-0 left-0 z-10 flex w-full bg-gradient-to-t from-white/60 px-3 pb-10 dark:from-black/60 sm:px-10"
	>
		<div
			class="pointer-events-auto relative w-full rounded-md border border-zinc-400 bg-zinc-100 p-3 shadow-md dark:border-zinc-600 dark:bg-zinc-800 sm:max-w-[500px]"
		>
			<div class="flex items-center justify-between text-sm">
				<h2 class="mr-1 cursor-default font-bold text-sky-600 dark:text-sky-400">Selected route</h2>
				<button
					class="cursor-pointer hover:text-sky-600 hover:dark:text-sky-400"
					on:click={() => (selectedGpxPath = null)}
				>
					<CloseIcon />
				</button>
			</div>
			<a class="group inline-block w-full" href={selectedPost.path}>
				<h3
					class="inline border-b border-b-zinc-600 font-bold group-hover:border-b-2 group-hover:border-b-sky-600 dark:border-b-zinc-400 dark:group-hover:border-b-sky-400"
				>
					{selectedPost.meta.title}
				</h3>
				<span class="font-bold text-zinc-600 before:mx-2 before:content-['/'] dark:text-zinc-400">
					{format(parseISO(selectedPost.meta.date), 'MMMM d, yyyy')}
				</span>
				<div class="prose prose-zinc max-w-none">
					<p class="text-base text-zinc-700 dark:text-zinc-300">{selectedPost.meta.description}</p>
				</div>
			</a>
			<div
				class="post-img-carousel pointer-events-none absolute left-full top-0 z-10 hidden h-full w-[100vw] md:flex"
			>
				{#each selectedPost.imagesHtml as imageHtml}
					{@html imageHtml}
				{/each}
			</div>
		</div>
	</div>
{/if}

<MapFullScreen bind:selectedPostPath bind:selectedGpxPath postMapPreviews={data.posts} />

<style>
	:global(.post-img-carousel img) {
		margin-left: 1.25rem;
		border-radius: 0.375rem;
		height: 100%;
		pointer-events: auto;
		color: transparent;
		background-color: #18181b; /* zinc-300 */
		--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
			0 2px 4px -2px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}
</style>
