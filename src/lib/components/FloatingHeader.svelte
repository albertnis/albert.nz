<script lang="ts">
	import Logo from './Logo.svelte'

	let y: number
</script>

<div
	class="z-100 invisible sticky top-0 left-0 col-start-2 col-end-3 flex h-0 -translate-x-20 overflow-visible text-3xl text-zinc-600 opacity-0 transition-all dark:text-zinc-400 lgxl:visible"
	class:opacity-100={y > 250}
	class:translate-y-10={y > 250}
>
	<span
		><a class="hover:text-zinc-800 dark:hover:text-zinc-200" href="/" aria-label="Home page"
			><Logo /></a
		></span
	>
</div>

<svelte:window bind:scrollY={y} />
