import { fetchMarkdownPosts } from '$lib/utils'
import { json } from '@sveltejs/kit'
import type { PostPreview, PostWithContent } from '../../../types/post'

export const GET = async () => {
	const allPosts = await fetchMarkdownPosts()

	return json(allPosts.map(postWithContentToPostPreview))
}

const postWithContentToPostPreview = (p: PostWithContent): PostPreview => ({
	meta: p.meta,
	path: p.path
})
