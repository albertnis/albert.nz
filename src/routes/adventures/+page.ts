import type { PostMapPreview } from '../types/post'

export const load = async ({ fetch }: { fetch: typeof window.fetch }) => {
	const response = await fetch(`/api/postRoutes`)
	const posts = (await response.json()) as PostMapPreview[]

	return {
		posts
	}
}
