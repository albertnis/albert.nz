<script lang="ts">
	import FloatingHeader from '$lib/components/FloatingHeader.svelte'
</script>

<div class="grid grid-cols-layout-sm md:grid-cols-layout-md">
	<FloatingHeader />
	<slot />
</div>
