import type { PostMapPreview } from '../../types/post'

export const load = async ({ fetch }: { fetch: typeof window.fetch }) => {
	const response = await fetch(`/api/postRoutes`)
	const posts = (await response.json()) as PostMapPreview[]

	return {
		posts,
		title: 'Adventures Map | Albert Nisbet',
		description: 'Interactive map showing a variety of recommended tramps and hikes in New Zealand'
	}
}
