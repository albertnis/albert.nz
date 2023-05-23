import { visit } from 'unist-util-visit'

export const rehypeLazyImg = () => (tree) =>
	visit(tree, 'element', (node) => {
		if (node.tagName === 'img' && node.properties && typeof node.properties.loading !== 'string') {
			node.properties.loading = 'lazy'
		}
	})
