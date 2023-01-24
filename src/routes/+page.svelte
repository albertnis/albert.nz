<script lang="ts">
	import { format, parseISO } from 'date-fns'
	import type { PostPreview } from '../types/post'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	export let data: { posts: PostPreview[] }
</script>

<Header />

<div class="col-start-[wide-start] col-end-[wide-end]">
	<h2 class="text-4xl font-bold">Latest posts</h2>

	<ul class="col-start-2 col-end-5 mt-10">
		{#each data.posts as post}
			<li class="my-8">
				<a class="group" href={post.path}>
					<h3
						class="inline border-b border-b-stone-600 font-bold group-hover:border-b-2 group-hover:border-b-blue-600 dark:border-b-stone-400 dark:group-hover:border-b-blue-400"
					>
						{post.meta.title}
					</h3>
					<span class="text-stone-600 dark:text-stone-400">&nbsp;/&nbsp;</span>
					<span class="font-bold text-stone-600 dark:text-stone-400">
						{format(parseISO(post.meta.date), 'MMMM d, yyyy')}
					</span>
					<div class="prose prose-stone max-w-none">
						<p class="text-base text-stone-700 dark:text-stone-300">{post.meta.description}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<Footer />
