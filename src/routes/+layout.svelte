<script>
	import FloatingHeader from '$lib/components/FloatingHeader.svelte'
	import '../app.css'
</script>

<div
	class="min-h-full bg-stone-200 font-inter text-lg text-stone-800 dark:bg-stone-800 dark:text-stone-200"
>
	<div class="grid grid-cols-layout-sm lg:grid-cols-layout-lg">
		<FloatingHeader />
		<slot />
	</div>
</div>
