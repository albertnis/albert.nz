import { fetchMarkdownPosts } from '$lib/utils'
import { json } from '@sveltejs/kit'
import type { PostPreview as PostMapPreview, PostWithContent } from '../../../types/post'

export const GET = async () => {
	const allPosts = await fetchMarkdownPosts()

	const allPreviews = await Promise.all(allPosts.map(postWithContentToPostMapPreview))

	return json(allPreviews)
}

const postWithContentToPostMapPreview = async (p: PostWithContent): Promise<PostMapPreview> => {
	const routes = p.meta.routes ?? []

	const geo = await Promise.all(
		routes.map(async (relPath) => {
			const routeSlug = relPath.substring(2, relPath.length - 4)
			return (await import(`../../../../content/blog/${p.path.slice(1)}/${routeSlug}.gpx`)).default
		})
	)

	return {
		meta: p.meta,
		path: p.path,
		geo
	}
}
