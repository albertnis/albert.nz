<script lang="ts">
	import type { Picture } from 'vite-imagetools'
	import {} from 'svelte'

	export let data: Picture | string
	export let imgAttributes: Record<string, string>
</script>

{#if typeof data === 'string'}
	<picture>
		<img class={imgAttributes.className} {...imgAttributes} src={data} />
	</picture>
{:else}
	<picture>
		{#each Object.entries(data.sources) as [format, images]}
			<source srcset={images} type={`image/${format}`} />
		{/each}
		<img class={imgAttributes.className} {...imgAttributes} src={data.img.src} />
	</picture>
{/if}
