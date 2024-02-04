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

	if (absPath.match(imagetoolsMatch)) {
		const src = `[${defaultImport}].flat()[[${defaultImport}].flat().length - 1].src`
		const srcId = randomUUID()
		node.properties.src = srcId
		replaceMap[srcId] = src

		const srcset = `[${defaultImport}].flat().map(im => \`\${im.src} \${im.width}w\`).join(',')`
		const srcsetId = randomUUID()
		node.properties.srcset = srcsetId
		replaceMap[srcsetId] = srcset

		const style = `[${defaultImport}].flat()[0].aspect`
		const styleId = randomUUID()
		node.properties.style = `aspect-ratio: ${styleId};` + (node.properties.style ?? '')
		replaceMap[styleId] = style

		node.properties.sizes = 'auto'
	} else {
		const src = defaultImport
		const srcId = randomUUID()
		node.properties.src = srcId
		replaceMap[srcId] = src
	}

	imports.push(importStatement)
}

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
