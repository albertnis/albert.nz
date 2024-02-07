import type { Node } from 'unist'
import type { Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin to add the `loading="lazy"` attribute to all img elements.
 *
 * This plugin does not work on raw img elements so may need to be preceded by rehype-raw.
 */
export const rehypeLazyImg = () => (tree: Node) =>
	visit(tree, { type: 'element' }, (n) => {
		const node = n as Element
		if (node.tagName === 'img' && node.properties && typeof node.properties.loading !== 'string') {
			node.properties.loading = 'lazy'
		}
	})
