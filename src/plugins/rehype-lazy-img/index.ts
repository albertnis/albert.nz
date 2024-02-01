import type { Node } from 'unist'
import type { Element } from 'hast'
import { visit } from 'unist-util-visit'

export const rehypeLazyImg = () => (tree: Node) =>
	visit(tree, { type: 'element' }, (n) => {
		const node = n as Element
		if (node.tagName === 'img' && node.properties && typeof node.properties.loading !== 'string') {
			node.properties.loading = 'lazy'
		}
	})
