<script lang="ts">
	import FloatingHeader from '$lib/components/FloatingHeader.svelte'
</script>

<div class="grid grid-cols-layout-sm lg:grid-cols-layout-lg">
	<FloatingHeader />
	<slot />
</div>
