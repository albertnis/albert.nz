<script lang="ts">
	export let tag: 'technology' | 'adventures'
	export let enabled: boolean

	let text: Record<typeof tag, string> = {
		adventures: 'Adventures',
		technology: 'Technology'
	}

	const handleClick = () => (enabled = !enabled)
</script>

<label
	class="relative inline-flex h-[1em] cursor-pointer items-center align-middle"
	class:font-bold={enabled}
>
	<input
		class="appearance-none"
		type="checkbox"
		checked={enabled}
		name={tag}
		value={tag}
		on:change={handleClick}
	/>
	{#if !enabled}
		<span
			class="rounded-full border border-zinc-800 px-2 text-[0.6em] line-through opacity-60 dark:border-zinc-400"
			>{text[tag]}</span
		>
	{:else if tag === 'technology'}
		<span
			class="rounded-full border border-purple-800 bg-purple-600 px-2 text-[0.6em] text-zinc-50 dark:border-purple-400"
			>{text[tag]}</span
		>
	{:else if tag === 'adventures'}
		<span
			class="rounded-full border border-teal-800 bg-teal-600 px-2 text-[0.6em] text-zinc-50 dark:border-teal-400"
			>{text[tag]}</span
		>{/if}
</label>
