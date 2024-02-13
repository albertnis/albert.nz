import { fetchMarkdownPosts } from '$lib/utils'
import { json } from '@sveltejs/kit'
import type { Image, PostWithContent } from '../../../types/post'
import { parse } from 'node-html-parser'

export const GET = async () => {
	const allPosts = await fetchMarkdownPosts()

	return json(allPosts.flatMap(postToImages))
}

const postToImages = (p: PostWithContent): Image[] => {
	const dom = parse(p.contentHtml)

	return dom.getElementsByTagName('img').map((i) => {
		const aspect = parseFloat(i.getAttribute('data-aspect') ?? '')
		let size = '480px'
		if (aspect >= 2.5) {
			size = '(max-width: 480px) 480px, 1536px'
		} else if (aspect >= 1.5) {
			size = '(max-width: 480px) 480px, 768px'
		}
		i.setAttribute('sizes', size)
		return {
			imageHtml: i.toString(),
			postSlug: p.path,
			tags: p.meta.tags,
			aspectRatio: parseFloat(i.getAttribute('data-aspect') ?? '')
		}
	})
}
