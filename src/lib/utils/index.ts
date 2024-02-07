import type { PostMetadata, PostWithContent } from '../../types/post'
import type { RemarkRehypePluginOutput } from '../../plugins/vite-plugin-remark'

export const fetchMarkdownPosts = async (): Promise<PostWithContent[]> => {
	const allPostFiles = import.meta.glob('/content/blog/**/index.md')
	const iterablePostFiles = Object.entries(allPostFiles)

	const allPosts: PostWithContent[] = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const result = ((await resolver()) as any).default as RemarkRehypePluginOutput
			const postPath = path.slice(13, -9)

			return {
				meta: result.metadata as unknown as PostMetadata,
				path: postPath,
				contentHtml: result.html
			}
		})
	)

	allPosts.sort((a, b) => {
		return new Date(b.meta.date as string).valueOf() - new Date(a.meta.date as string).valueOf()
	})

	return allPosts
}
