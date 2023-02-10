<script lang="ts">
	export let tag: 'technology' | 'adventures'

	let text: Record<typeof tag, string> = {
		adventures: 'Adventures',
		technology: 'Technology'
	}
</script>

<span
	class="ml-1 inline-block h-[0.8em] w-[0.8em]  rounded-full border align-baseline "
	class:bg-purple-600={tag === 'technology'}
	class:border-purple-800={tag === 'technology'}
	class:dark:border-purple-400={tag === 'technology'}
	class:bg-teal-600={tag === 'adventures'}
	class:border-teal-800={tag === 'adventures'}
	class:dark:border-teal-400={tag === 'adventures'}
	title={text[tag]}
/>
