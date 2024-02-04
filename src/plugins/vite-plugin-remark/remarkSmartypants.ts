import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { Literal } from 'mdast'
import { retext } from 'retext'
import retextSmartypants from 'retext-smartypants'

/**
 * Remark plugin which converts grammar as defined by smartypants
 */
export const remarkSmartypants = () => (tree: Node) => {
	visit(tree, { type: 'text' }, (n: Node) => {
		const node = n as Literal
		const newText = String(retext().use(retextSmartypants).processSync(node.value))
		node.value = newText
	})
}
