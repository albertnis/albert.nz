import type { Post, PostMetadata, PageData } from '../../types/post'

export const load = async ({ params }: { params: { slug: string } }): Promise<PageData<Post>> => {
	const post = await import(`../../../content/blog/${params.slug}/index.md`)
	const meta: PostMetadata = post.metadata
	const content = post.default

	const routes = meta.routes ?? []

	const geo = await Promise.all(
		routes.map(async (relPath) => {
			const routeSlug = relPath.substring(2, relPath.length - 4)
			return (await import(`../../../content/blog/${params.slug}/${routeSlug}.gpx`)).default
		})
	)

	return {
		meta,
		content,
		geo,
		title: `${meta.title} | Albert Nisbet`,
		description: meta.description
	}
}
