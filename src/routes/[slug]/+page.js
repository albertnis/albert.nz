export const load = async ({ params }) => {
	const post = await import(`../../../content/blog/${params.slug}/index.md`)
	const { title } = post.metadata
	const content = post.default

	return {
		title,
		content
	}
}
