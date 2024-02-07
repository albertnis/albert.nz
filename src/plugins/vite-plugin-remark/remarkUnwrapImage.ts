import type { Paragraph } from 'mdast'
import { visit } from 'unist-util-visit'
import type { Node } from 'unist'

/**
 * Remark plugin which converts paragraphs with a single imageReference to just the imageReference
 */
export const remarkUnwrapImage = () => (tree: Node) => {
	visit(tree, { type: 'paragraph' }, (n, index, parent: any) => {
		const node = n as Paragraph

		if (node.children.length === 1 && node.children[0].type === 'imageReference') {
			parent.children.splice(index, 1, node.children[0])
		}
	})
}
