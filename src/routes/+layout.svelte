<script lang="ts">
	import { page } from '$app/stores'
	import '../app.css'
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta property="og:title" content={$page.data.title} />
	<meta property="og:url" content={$page.url.href} />
	<meta name="description" content={$page.data.description} />
	<meta property="og:description" content={$page.data.description} />
	<meta property="og:locale" content="en_NZ" />
</svelte:head>

<div
	class="min-h-full print:bg-white print:text-black bg-zinc-100 font-inter text-lg text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
>
	<slot />
</div>
