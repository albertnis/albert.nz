import type { PostPreview } from '../types/post'

export const load = async ({ fetch }: { fetch: typeof window.fetch }) => {
	const response = await fetch(`/api/posts`)
	const posts = (await response.json()) as PostPreview[]

	return {
		posts
	}
}
