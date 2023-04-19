<script>
	import { page } from '$app/stores'
	import HeaderSmall from '$lib/components/HeaderSmall.svelte'
</script>

<HeaderSmall />
<div class="col-start-[wide-start] col-end-[wide-end]">
	<h1 class="text-6xl font-bold">Error {$page.status}</h1>
	{#if $page.error != null}
		<div>{$page.error.message}</div>
	{/if}
	<a class="underline" href="/">Back to homepage</a>
</div>
