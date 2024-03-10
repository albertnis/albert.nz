<script lang="ts">
	import Logo from './Logo.svelte'

	export let country: string | null
</script>

<header class="col-start-[wide-start] col-end-[wide-end]">
	<h1
		class="mb-10 mt-5 flex cursor-default align-middle text-3xl font-extrabold sm:mb-20 sm:mt-20 sm:text-4xl"
	>
		<span class="contents text-zinc-600 dark:text-zinc-400"><Logo /></span><span
			class="ml-1 sm:ml-5">Albert Nisbet</span
		>
	</h1>
	<div class="my-10 text-base sm:text-lg font-medium sm:my-20">
		<p>
			<b>
				country is {country}
				{#if country === 'NZ'}
					Kia ora!
				{:else}
					Hi!
				{/if}
			</b>
		</p>

		<p>
			I'm Albert, a Christchurch-based software engineer. Find me on <a
				href="https://linkedin.com/in/albertnis"
				class="border-b border-b-zinc-600 hover:border-b-2 hover:border-b-blue-600 dark:border-b-zinc-400 dark:hover:border-b-blue-400"
				>LinkedIn</a
			>
			and
			<a
				href="https://github.com/albertnis"
				class="border-b border-b-zinc-600 hover:border-b-2 hover:border-b-blue-600 dark:border-b-zinc-400 dark:hover:border-b-blue-400"
				>GitHub</a
			>.
		</p>
	</div>
</header>
