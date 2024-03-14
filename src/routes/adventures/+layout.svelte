<script lang="ts">
	import Logo from '$lib/components/Logo.svelte'
</script>

<div
	class="fixed left-5 top-5 z-10 text-xl bg-zinc-200 dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-50 flex rounded-md backdrop-blur-md items-center justify-between p-[1rem] sm:justify-start sm:p-4 shadow-md"
>
	<a
		class="headerLink pointer-events-auto opacity-50 hover:opacity-100 dark:text-zinc-200 text-zinc-800 relative bottom-[0.05em]"
		href="/"
		aria-label="Home page"><Logo /></a
	>

	<div class="ml-2 border-zinc-400 align-middle leading-none font-bold">Adventures Map</div>
</div>

<slot />

<style>
	:global(.headerLink svg path) {
		transition: d 0.2s ease-out;
		d: path('M4, 7L1, 7L4, 2L7, 7L10, 2');
	}

	:global(.headerLink:hover svg path) {
		d: path('M4, 7L1, 4.5L4, 2L1, 4.5L7, 4.5');
	}
</style>
