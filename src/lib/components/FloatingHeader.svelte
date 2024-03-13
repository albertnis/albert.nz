<script lang="ts">
	import Logo from './Logo.svelte'

	let y: number
</script>

<div
	class="z-100 invisible sticky top-10 left-0 col-start-2 col-end-3 flex h-0 -translate-x-20 overflow-visible text-2xl text-zinc-600 transition-all dark:text-zinc-400 lgxl:visible"
>
	<span
		><a
			class="text-zinc-800 opacity-50 hover:opacity-100 dark:text-zinc-200 floatingHeaderLink"
			class:floatingHeaderLink_visible={y > 250}
			href="/"
			aria-label="Home page"
			title="Home"><Logo /></a
		></span
	>
</div>

<svelte:window bind:scrollY={y} />

<style>
	:global(.floatingHeaderLink svg path) {
		stroke-dashoffset: 1;
		stroke-dasharray: 1;
		transition: none;
	}

	:global(.floatingHeaderLink_visible svg path) {
		stroke-dashoffset: 0;
		stroke-dasharray: 1;
		transition: stroke-dashoffset 0.5s ease-out 1s;
	}
</style>
