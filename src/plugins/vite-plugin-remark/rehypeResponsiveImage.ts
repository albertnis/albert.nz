import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { Element } from 'hast'
import type { VFile } from 'vfile'
import path from 'node:path'
import fs from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'

type ReplaceMap = Record<string, string>

const imagetoolsMatch = /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)(\?.*)?$/

const processImageNode = async (
	replaceMap: ReplaceMap,
	imports: string[],
	node: Element,
	file: VFile
): Promise<void> => {
	const relPath = node.properties.src as string

	if (file.dirname == null) {
		throw new Error(`File has no path`)
	}

	const absPath = path.join(file.dirname, relPath)

	if (!fs.existsSync(absPath)) {
		throw new Error(
			`Could not import image ${relPath} relative to ${file.dirname} because it does not exist`
		)
	}

	const defaultImport = '_' + createHash('md5').update(absPath).digest('hex')
	const importStatement = `import ${defaultImport} from "${absPath}"`
	const imagesVar = `[${defaultImport}].flat()`

	if (absPath.match(imagetoolsMatch)) {
		const src = `${imagesVar}[${imagesVar}.length - 1].src` // Use biggest image as nominal src
		const srcId = randomUUID()
		node.properties.src = srcId
		replaceMap[srcId] = src

		const srcset = `${imagesVar}.map(im => \`\${im.src} \${im.width}w\`).join(',')`
		const srcsetId = randomUUID()
		node.properties.srcset = srcsetId
		replaceMap[srcsetId] = srcset

		const aspect = `(${imagesVar}[0].width / ${imagesVar}[0].height).toFixed(3)` // `.aspect` not always present
		const styleAspectId = randomUUID()
		node.properties.style = `aspect-ratio: ${styleAspectId};` + (node.properties.style ?? '')
		replaceMap[styleAspectId] = aspect

		const dataAspectId = randomUUID()
		node.properties.dataAspect = dataAspectId
		replaceMap[dataAspectId] = aspect

		node.properties.sizes = 'auto'
	} else {
		const src = defaultImport
		const srcId = randomUUID()
		node.properties.src = srcId
		replaceMap[srcId] = src
	}

	imports.push(importStatement)
}

/**
 * Rehype plugin to convert img tags using relative src into responsive versions.
 *
 * Requires `vite-imagetools` to be installed.
 *
 * For file types supported by `vite-imagetools`, the plugin will do the following
 * - Convert src attribute value into a URL to a responsive image
 * - Add srcset attribute with URLs
 * - Add aspect ratio to inline style
 *
 * Unsupported file types for relative src will be converted to a JS import
 *
 * Non-relative src will be untouched
 *
 * Import statements are set on `file.data.imports`.
 * String replacements are set on `file.data.replaceMap` - the key is the value written to the AST
 * and the value is the expression with which the key will be replaced in the serialised output
 */
export const rehypeResponsiveImage = () => async (tree: Node, file: VFile) => {
	const nodes: Element[] = []

	visit(tree, isRelativeImage, (n: Node) => {
		const node = n as Element
		nodes.push(node)
	})

	const promises: Promise<void>[] = []
	const imports: string[] = []
	const replaceMap: Record<string, string> = {}

	for (const node of nodes) {
		promises.push(processImageNode(replaceMap, imports, node, file))
	}

	await Promise.all(promises)

	file.data.imports = imports
	file.data.replaceMap = replaceMap
}

const isRelativeImage = (node: any): node is Element =>
	node.type === 'element' && node.properties.src?.startsWith('.')
