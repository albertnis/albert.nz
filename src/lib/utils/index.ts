import type { PostMetadata, PostPreview } from '../../types/post'

interface ResolverResult {
	metadata: PostMetadata
}

export const fetchMarkdownPosts = async (): Promise<PostPreview[]> => {
	const allPostFiles = import.meta.glob('/content/blog/**/index.md')
	const iterablePostFiles = Object.entries(allPostFiles)

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = (await resolver()) as ResolverResult
			const postPath = path.slice(13, -9)

			return {
				meta: metadata,
				path: postPath
			}
		})
	)

	return allPosts
}
