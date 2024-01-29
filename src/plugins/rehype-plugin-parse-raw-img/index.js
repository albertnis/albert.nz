import { raw } from 'hast-util-raw'
import { visit } from 'unist-util-visit'

export const parseRawImg = () => (tree) =>
	visit(tree, isRawImage, (node, index, parent) => {
		let outputNode

		try {
			outputNode = raw(node)
		} catch {
			outputNode = node
		}

		parent.children.splice(index, 1, ...outputNode.children)
	})

const isRawImage = (node) => {
	return node.type === 'raw' && node.value.trim().startsWith('<img')
}
