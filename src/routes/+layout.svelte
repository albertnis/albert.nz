<script lang="ts">
	import FloatingHeader from '$lib/components/FloatingHeader.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import '../app.css'
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="description" content={$page.data.description} />
</svelte:head>

<div
	class="min-h-full bg-stone-200 font-inter text-lg text-stone-800 dark:bg-stone-800 dark:text-stone-200"
>
	<div class="grid grid-cols-layout-sm lg:grid-cols-layout-lg">
		<FloatingHeader />
		<slot />
	</div>
</div>
