<script lang="ts">
	import type { Picture } from 'vite-imagetools'

	export let data: Picture | string
	export let imgAttributes: Record<string, string | undefined>

	const sizes = imgAttributes?.className?.includes('prose-custom-w-full')
		? '(max-width: 480px) 480px, (max-width: 768px) 768px, 2560px'
		: '(max-width: 480px) 480px, 768px'
</script>

{#if typeof data === 'object' && 'sources' in data}
	<picture>
		{#each Object.entries(data.sources) as [format, images]}
			<source srcset={images} type={`image/${format}`} {sizes} />
		{/each}
		<img class={imgAttributes.className} {...imgAttributes} src={data.img.src} />
	</picture>
{:else}
	<picture>
		<img class={imgAttributes.className} {...imgAttributes} src={data} />
	</picture>
{/if}
