import type { SvelteComponent } from 'svelte'
import type { PostMetadata, PostWithContent } from '../../types/post'

interface ResolverResult {
	metadata: PostMetadata
	default: SvelteComponent
}

export const fetchMarkdownPosts = async (): Promise<PostWithContent[]> => {
	const allPostFiles = import.meta.glob('/content/blog/**/index.md')
	const iterablePostFiles = Object.entries(allPostFiles)

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const result = (await resolver()) as ResolverResult
			const postPath = path.slice(13, -9)

			return {
				meta: result.metadata,
				path: postPath,
				contentHtml: result.default.render().html
			}
		})
	)

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).valueOf() - new Date(a.meta.date).valueOf()
	})

	return sortedPosts
}
