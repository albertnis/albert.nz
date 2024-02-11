import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import type { Element, Text } from 'hast'

/**
 * Rehype plugin to wrap img elements with an alt element with a figure element containing a caption.
 *
 * The caption text will be set to the value of the alt tag.
 *
 * Images without an alt attribute will not be altered.
 *
 * If the img is the only child of a p tag, the entire p tag will be replaced with the figure.
 *
 * This plugin does not work on raw img elements so may need to be preceded by rehype-raw.
 */
export const rehypeFigure = () => (tree: Node) =>
	visit(tree, { type: 'element', tagName: 'img' }, (n, index, parent: any) => {
		const node = n as Element

		const alt = node.properties.alt

		if (typeof alt !== 'string' || alt === '') {
			return
		}

		if (parent.tagName === 'figure') {
			// Img is already in a figure - leave it untouched
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

		if (parent.tagName === 'p' && parent.children.length === 1) {
			// img is only child of a p. Figures aren't allowed in a p. So replace the parent.
			parent.tagName = outputNode.tagName
			parent.properties = outputNode.properties
			parent.children = outputNode.children
		} else if (parent.tagName !== 'p') {
			// replace img with figure in-place
			parent.children.splice(index, 1, outputNode)
		}

		// The parent is a p but has other children. Leave img untouched to be safe.
	})
