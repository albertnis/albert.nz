import { fetchMarkdownPosts } from '$lib/utils'
import { json } from '@sveltejs/kit'
import type { PostMapPreview, PostWithContent } from '../../../types/post'
import { parse } from 'node-html-parser'

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

	const imagesHtml = parse(p.contentHtml)
		.getElementsByTagName('picture')
		.map((pic) => {
			const sources = pic.getElementsByTagName('source')
			for (const source of sources) {
				source.setAttribute('sizes', '480px')
			}

			return pic
		})
		.map((img) => img.toString())

	return {
		imagesHtml,
		meta: p.meta,
		path: p.path,
		geo
	}
}
