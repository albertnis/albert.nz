<script>
	import Logo from './Logo.svelte'
</script>

<header class="col-start-[wide-start] col-end-[wide-end]">
	<h1 class="mb-10 mt-5 cursor-default text-2xl font-inter font-extrabold sm:mb-20 sm:mt-20">
		<span class="text-zinc-600 dark:text-zinc-400"><Logo /></span><span class="ml-[0.25em]"
			>Albert Nisbet</span
		>
	</h1>
	<div class="mt-32 text-lg font-medium sm:mt-20 max-w-md sm:max-w-full">
		<p class="text-3xl mb-6">
			<b><span data-i18n="home.greeting">Hi</span>, I'm Albert!</b>
		</p>

		<p class="text-zinc-700 dark:text-zinc-300">
			I'm a product software engineer based in
			<span data-i18n="home.city">Christchurch, New Zealand</span>. My passion is crafting quality
			software to solve interesting problems. I have a track record of doing just that at
			<a
				class="border-b border-b-zinc-600 hover:border-b-4 transition-all duration-75 hover:border-b-[#13b5ea] dark:border-b-zinc-400"
				href="https://xero.com"
				rel="noreferrer">Xero</a
			>,
			<a
				class="border-b border-b-zinc-600 hover:border-b-4 transition-all duration-75 hover:border-b-[#7e54e3] dark:border-b-zinc-400"
				href="https://hatchinvest.nz"
				rel="noreferrer">Hatch</a
			>
			and
			<a
				class="border-b border-b-zinc-600 hover:border-b-4 transition-all duration-75 hover:border-b-[#ff5f16] dark:border-b-zinc-400"
				href="https://kilterset.com"
				rel="noreferrer">Kilterset</a
			>.
		</p>
		<p class="mt-6">
			<b>Want to build something together?</b>
		</p>
		<p class="text-zinc-700 dark:text-zinc-300">
			Get in touch through
			<a
				href="https://linkedin.com/in/albertnis"
				class="border-b border-b-zinc-600 hover:border-b-4 transition-all duration-75 hover:border-b-[#0a66c2] dark:border-b-zinc-400"
				rel="noreferrer">LinkedIn</a
			>
			or find me on
			<a
				href="https://github.com/albertnis"
				class="border-b border-b-zinc-600 hover:border-b-4 transition-all duration-75 hover:border-b-black dark:border-b-zinc-400 dark:hover:border-b-white"
				rel="noreferrer">GitHub</a
			>.
		</p>
	</div>
</header>
