import type { RemarkRehypePluginOutput } from '../../../plugins/vite-plugin-remark'
import type { Post, PostMetadata, PageData } from '../../../types/post'
import { updateSizesForArticle } from '$lib/utils/sizes'
import type { EntryGenerator } from './$types'

export const entries: EntryGenerator = () => {
	const allPostFiles = import.meta.glob('/content/blog/**/index.md')

	return Object.keys(allPostFiles).map((path) => ({ slug: path.slice(14, -9) }))
}

export const load = async ({ params }: { params: { slug: string } }): Promise<PageData<Post>> => {
	const post = (await import(`../../../../content/blog/${params.slug}/index.md`))
		.default as RemarkRehypePluginOutput
	const meta: PostMetadata = post.metadata as unknown as PostMetadata
	const content = updateSizesForArticle(post.html)

	const routes: string[] = meta.routes ?? []

	const getGeo = async () =>
		await Promise.all(
			routes.map(async (relPath) => {
				const routeSlug = relPath.substring(2, relPath.length - 4)
				const gpxData = (await import(`../../../../content/blog/${params.slug}/${routeSlug}.gpx`))
					.default
				return gpxData
			})
		)

	return {
		meta,
		content,
		geo: await getGeo(),
		title: `${meta.title} | Albert Nisbet`,
		description: meta.description
	}
}
