import { inspect } from 'node:util'
import type { Plugin } from 'vite'
import { unified } from 'unified'
import type { Node } from 'unist'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import type { VFile, Compatible as VFileCompatible } from 'vfile'
import { matter } from 'vfile-matter'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeRaw from 'rehype-raw'

import { remarkSmartypants } from '../remark-smartypants'
import { rehypeLazyImg } from '../rehype-lazy-img'
import { rehypeFigure } from '../rehype-figure'
import { rehypeResponsiveImage } from '../rehype-responsive-image'

type Serializable =
	| {
			[k: string | number]: Serializable
	  }
	| string
	| number
	| boolean
	| null
	| Serializable[]

export interface RemarkRehypePluginOutput {
	metadata?: Serializable
	html: string
}

const fileRegex = /\.md$/

export function remark(): Plugin {
	return {
		name: '',
		async transform(code, id) {
			if (!fileRegex.test(id)) return null

			const data = await compileMarkdownToJs(code)
			return {
				code: `export default ${JSON.stringify(data)}`
			}
		}
	}
}

const realLog = (item: any) => console.log(inspect(item, true, null, true))

const log = () => (tree: Node, file: VFile) => realLog({ tree, file })

const parseMatter =
	() =>
	(_: Node, file: VFile): void => {
		matter(file)
	}

const processor = unified()
	.use(remarkParse)
	.use(remarkFrontmatter, ['yaml'])
	.use(remarkMath)
	.use(remarkSmartypants)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeKatex, { output: 'mathml' })
	.use(rehypeRaw)
	.use(rehypeResponsiveImage)
	.use(rehypeFigure)
	.use(rehypeLazyImg)
	.use(rehypeStringify)
	.use(log)
	.use(parseMatter)

export const compileMarkdownToJs = async (
	fileData: VFileCompatible
): Promise<RemarkRehypePluginOutput> => {
	const output = await processor.process(fileData)

	return {
		metadata: output.data.matter as Serializable | undefined,
		html: output.value as string
	}
}
