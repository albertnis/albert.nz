import type { PageLoad } from './$types'
import type { PostPreview } from '../../types/post'

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`/api/postPreviews`)
	const posts = (await response.json()) as PostPreview[]

	return {
		posts
	}
}
