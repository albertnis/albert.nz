import { visitParents } from 'unist-util-visit-parents'
import type { Node } from 'unist'
import type { Literal } from 'mdast'
import { retext } from 'retext'
import retextSmartypants from 'retext-smartypants'
import type { Element } from 'hast'

/**
 * Remark plugin which converts grammar as defined by smartypants
 */
export const rehypeSmartypants = () => (tree: Node) => {
	visitParents(tree, { type: 'text' }, (n, ancestors: Node[]) => {
		if (ancestors.some((a) => a.type === 'element' && (a as Element).tagName === 'pre')) {
			// Don't touch preformatted text
			return
		}
		const node = n as Literal
		const newText = String(retext().use(retextSmartypants).processSync(node.value))
		node.value = newText
	})
}
