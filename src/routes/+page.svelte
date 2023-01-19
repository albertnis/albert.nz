<script>
	export let data
</script>

<h1 class="text-3xl font-bold underline">Albert Nisbet</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
	{#each data.posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
		</li>
	{/each}
</ul>
