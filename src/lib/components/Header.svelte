<script>
	import Logo from './Logo.svelte'
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
			<b><span data-i18n="home.greeting">Hi</span>, I'm Albert!</b>
		</p>

		<p>
			I'm a product software engineer based in
			<span data-i18n="home.city">Christchurch, New Zealand</span>. My passion is building quality
			software to solve interesting problems. I have a track record of doing just that at
			<a
				class="border-b border-b-zinc-600 hover:border-b-2 hover:border-b-blue-600 dark:border-b-zinc-400 dark:hover:border-b-blue-400"
				href="https://xero.com">Xero</a
			>,
			<a
				class="border-b border-b-zinc-600 hover:border-b-2 hover:border-b-blue-600 dark:border-b-zinc-400 dark:hover:border-b-blue-400"
				href="https://hatchinvest.nz">Hatch</a
			>
			and
			<a
				class="border-b border-b-zinc-600 hover:border-b-2 hover:border-b-blue-600 dark:border-b-zinc-400 dark:hover:border-b-blue-400"
				href="https://kilterset.com">Kilterset</a
			>.
		</p>
		<p class="mt-6">
			<b>Want to build something together?</b>
		</p>
		<p>
			Get in touch: You can find me on
			<a
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
