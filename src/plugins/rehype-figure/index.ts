import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import type { Element, Text } from 'hast'

export const rehypeFigure = () => (tree: Node) =>
	visit(tree, { type: 'element', tagName: 'img' }, (n, index, parent: any) => {
		const node = n as Element

		const alt = node.properties.alt

		if (typeof alt !== 'string' || alt === '') {
			return
		}

		const captionContent: Text = {
			type: 'text',
			value: alt
		}

		const caption: Element = {
			type: 'element',
			tagName: 'figcaption',
			properties: {},
			children: [captionContent]
		}

		let outputNode: Element = {
			type: 'element',
			tagName: 'figure',
			properties: {},
			children: [node, caption]
		}

		parent.children.splice(index, 1, outputNode)
	})
