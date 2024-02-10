<script lang="ts">
	import Footer from '$lib/components/Footer.svelte'
	import Logo from '$lib/components/Logo.svelte'
</script>

<div class="bg-zinc-900 text-zinc-100 col-start-[full-start] col-end-[full-end]">
	<div
		class="fixed left-5 top-5 z-10 text-xl bg-zinc-800 bg-opacity-50 flex rounded-md backdrop-blur-md items-center justify-between p-[1rem] sm:justify-start sm:p-4 shadow-md"
	>
		<a
			class="pointer-events-auto flex opacity-50 hover:opacity-100 text-zinc-200 relative bottom-[0.05em]"
			href="/"
			aria-label="Home page"><Logo /></a
		>

		<div class="ml-2 border-zinc-400 align-middle leading-none font-bold">Gallery</div>
	</div>

	<slot />

	<div class="grid grid-cols-layout-sm md:grid-cols-layout-md">
		<Footer />
	</div>
</div>
