import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { Element } from 'hast'
import type { VFile } from 'vfile'
import path from 'node:path'
import type { ImageMetadata as BaseImageMetadata } from 'vite-imagetools'

type ImageMetadata = BaseImageMetadata & { src: string }

/**
 * Build the "universe" of images that could be imported
 * This needs to be done upfront so Vite can analyse the import
 *  */

const imagetoolsImagesRel = import.meta.glob<boolean, string, { default: ImageMetadata[] }>(
	'../../../content/blog/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}'
)

const otherImagesRel = import.meta.glob<boolean, string, string>(
	'../../../content/blog/**/*.{svg,SVG}'
)

const relImportsToAbs = <T>(imports: Record<string, () => Promise<T>>) =>
	Object.fromEntries(
		Object.entries(imports).map(([relPath, imp]) => [path.join(__dirname, relPath), imp])
	)

const imagetoolsImages = relImportsToAbs(imagetoolsImagesRel)
const otherImages = relImportsToAbs(otherImagesRel)

const srcsetFromMetadata = (im: ImageMetadata): string => `${im.src} ${im.width}w`

const updateNodeFromImage = async (node: Element, image: ImageMetadata[]) => {
	const mainImg = image[image.length - 1]
	node.properties.src = mainImg.src as string
	node.properties.srcset = image.map(srcsetFromMetadata).join(',')
	node.properties.sizes = 'auto'
	node.properties.style = `aspect-ratio: ${mainImg.aspect};` + (node.properties.style ?? '')
}

const processImageNode = async (node: Element, cwd: string): Promise<void> => {
	const relPath = node.properties.src as string
	const absPath = path.join(cwd, relPath)

	if (absPath in imagetoolsImages) {
		await updateNodeFromImage(node, (await imagetoolsImages[absPath]()).default)
	} else if (absPath in otherImages) {
		node.properties.src = await otherImages[absPath]()
	} else {
		throw new Error(
			`Could not import image ${relPath} relative to ${cwd}. Check that it exists and is a support image type.`
		)
	}
}

export const rehypeResponsiveImage = () => async (tree: Node, file: VFile) => {
	const nodes: Element[] = []

	visit(tree, isRelativeImage, (n: Node) => {
		const node = n as Element
		nodes.push(node)
	})

	const promises: Promise<void>[] = []

	for (const node of nodes) {
		promises.push(processImageNode(node, file.cwd))
	}

	await Promise.all(promises)
}

const isRelativeImage = (node: any): node is Element =>
	node.type === 'element' && node.properties.src?.startsWith('.')
