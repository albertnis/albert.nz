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
	<div class="my-10 mb-5 text-lg font-medium sm:mt-20">
		<p>
			<b>Kia ora!</b>
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

	<div
		class="mb-10 mt-10 rounded-md border border-blue-800 bg-blue-600 p-2 sm:p-4 text-zinc-50 dark:border-blue-400"
	>
		<div>
			<span class="font-bold">Work with me</span>
		</div>
		<div class="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1">
			<p class="">
				I have over five years' experience developing and shipping full-stack software products. <span
					class="font-bold"
				>
					Need a hand building your next website, product or business? <a
						href="mailto:albert@albert.nz"
						class="border-b hover:border-b-2 border-b-zinc-50">Get in touch</a
					>.
				</span>
			</p>
			<dl class="text-sm flex-shrink-0">
				<div class="flex gap-1">
					<dt class="text-blue-200">Location</dt>
					<dd class="font-bold">Christchurch / Remote</dd>
				</div>
				<div class="flex gap-1">
					<dt class="text-blue-200">Skills</dt>
					<dd><span class="font-bold">Rails, TypeScript, React</span> and more</dd>
				</div>
				<div class="flex gap-1">
					<dt class="text-blue-200">Experience</dt>
					<dd class="font-bold">Xero, Hatch, Kilterset</dd>
				</div>
			</dl>
		</div>
	</div>
</header>
