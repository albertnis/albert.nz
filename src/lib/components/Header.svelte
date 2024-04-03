<script>
	import Logo from './Logo.svelte'
</script>

<header
	class="col-start-[full-start] col-end-[full-end] bg-teal-400 dark:bg-teal-500 text-teal-950 grid grid-cols-subgrid"
>
	<div class="col-start-[wide-start] col-end-[wide-end] mb-10">
		<h1 class="mb-10 mt-5 cursor-default text-2xl font-extrabold sm:mb-20 sm:mt-20">
			<span><Logo /></span><span class="ml-[0.25em]">Albert Nisbet</span>
		</h1>
		<div class="mt-32 text-lg font-medium sm:mt-20">
			<p class="text-4xl sm:text-5xl mb-6">
				<b><span data-i18n="home.greeting">Hi</span>, I'm Albert!</b>
			</p>

			<p>
				I'm a product software engineer based in
				<span data-i18n="home.city">Christchurch, New Zealand</span>. My passion is crafting quality
				software to solve interesting problems. I have a track record of doing just that at
				<a
					class="underline decoration-teal-900 decoration-1 hover:decoration-4 transition-all duration-75"
					href="https://xero.com"
					rel="noreferrer">Xero</a
				>,
				<a
					class="underline decoration-teal-900 decoration-1 hover:decoration-4 transition-all duration-75"
					href="https://hatchinvest.nz"
					rel="noreferrer">Hatch</a
				>
				and
				<a
					class="underline decoration-teal-900 decoration-1 hover:decoration-4 transition-all duration-75"
					href="https://kilterset.com"
					rel="noreferrer">Kilterset</a
				>.
			</p>
			<p class="mt-6">
				<b>Want to build something together?</b>
			</p>
			<p>
				Get in touch through
				<a
					href="https://linkedin.com/in/albertnis"
					class="underline decoration-teal-900 decoration-1 hover:decoration-4 transition-all duration-75"
					rel="noreferrer">LinkedIn</a
				>
				or find me on
				<a
					href="https://github.com/albertnis"
					class="underline decoration-teal-900 decoration-1 hover:decoration-4 transition-all duration-75"
					rel="noreferrer">GitHub</a
				>.
			</p>
		</div>
	</div>
</header>
<div
	class="col-start-[full-start] col-end-[full-end] h-24 -mb-4 relative overflow-x-hidden overflow-y-hidden"
	aria-hidden="true"
>
	<svg
		class="dark:text-teal-700 text-teal-300 h-24 absolute divider z-5"
		viewBox="0 0 8 8"
		preserveAspectRatio="none"><path fill="currentColor" d="M0,0 L0,1 L2,7 L6,0 L8,6 L8,0" /></svg
	>
	<svg
		class="dark:text-teal-500 text-teal-400 h-16 absolute divider z-6"
		viewBox="0 0 8 8"
		preserveAspectRatio="none"><path fill="currentColor" d="M0,0 L0,1 L2,7 L6,0 L8,6 L8,0" /></svg
	>
</div>

<style>
	.divider {
		width: 150%;
		left: 50%;
		transform: translate(-50%, 0);
		min-width: 1068px;
	}
</style>
