<script>
	import Logo from './Logo.svelte'
</script>

<header class="col-start-[wide-start] col-end-3 mb-10 mt-5 md:mb-20 md:mt-20 md:col-end-[wide-end]">
	<a class="group headerSmallLink" href="/"
		><h1 class="text-xl font-extrabold sm:text-2xl">
			<span
				class="text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
				><Logo /></span
			><span class="ml-[0.25em]">Albert Nisbet</span>
		</h1></a
	>
</header>

<style>
	:global(.headerSmallLink svg path) {
		transition: d 0.2s ease-out;
		d: path("M4, 7L1, 7L4, 2L7, 7L10, 2");
	}

	:global(.headerSmallLink:hover svg path) {
		d: path("M4, 7L1, 4.5L4, 2L1, 4.5L7, 4.5");
	}
</style>
