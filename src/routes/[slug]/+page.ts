export const load = async ({ params }: { params: { slug: string } }) => {
	const post = await import(`../../../content/blog/${params.slug}/index.md`)
	const meta = post.metadata
	const content = post.default

	return {
		meta,
		content
	}
}
