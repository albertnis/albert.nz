import { raw } from 'hast-util-raw'
import { visit } from 'unist-util-visit'
import type { Node, Literal } from 'unist'
import type { Nodes } from 'hast'

export const rehypeRawImg = () => (tree: Node) =>
	visit(tree, isRawImage, (node: Node, index, parent: any) => {
		let outputNode: any

		try {
			outputNode = raw(node as Nodes)
		} catch {
			outputNode = node
		}

		parent.children.splice(index, 1, ...outputNode.children)
	})

const isRawImage = (node: any) => {
	return node.type === 'raw' && node.value.trim().startsWith('<img')
}
