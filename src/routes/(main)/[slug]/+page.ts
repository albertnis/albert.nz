import type { Post, PostMetadata, PageData } from '../../../types/post'

export const load = async ({ params }: { params: { slug: string } }): Promise<PageData<Post>> => {
	const post = await import(`../../../../content/blog/${params.slug}/index.md`)
	const meta: PostMetadata = post.metadata
	const content = post.default

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
