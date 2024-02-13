<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	let adventuresImages = data.images.filter((i) => i.tags.includes('adventures'))
</script>

<div
	class="pt-24 flex flex-wrap images-container w-full max-w-[1920px] mx-auto justify-stretch items-stretch gap-1 sm:gap-3"
>
	{#each adventuresImages as image}
		<a href={image.postSlug} data-aspect-ratio={Math.round(image.aspectRatio * 2) / 2}>
			{@html image.imageHtml}
		</a>
	{/each}
</div>

<style lang="css">
	:global(.images-container) {
		--img-w-base: calc(15% / 1.5);
	}

	@media only screen and (max-width: 1279px) {
		:global(.images-container) {
			--img-w-base: calc(25% / 1.5);
		}
	}

	@media only screen and (max-width: 767px) {
		:global(.images-container) {
			--img-w-base: calc(33% / 1.5);
		}
	}

	:global(.images-container > a) {
		flex: 1 1 var(--img-w-base);
	}

	:global(.images-container img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		color: transparent;
		background-color: #27272a; /* zinc-800 */
	}

	:global(.images-container a[data-aspect-ratio='4']) {
		flex-basis: calc(4 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='3.5']) {
		flex-basis: calc(4 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='3']) {
		flex-basis: calc(3 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='2.5']) {
		flex-basis: calc(3 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='2']) {
		flex-basis: calc(2 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='1.5']) {
		flex-basis: calc(1.5 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='1']) {
		flex-basis: calc(1 * var(--img-w-base));
	}

	:global(.images-container a[data-aspect-ratio='0.5']) {
		flex-basis: calc(0.5 * var(--img-w-base));
	}
</style>
