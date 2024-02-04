import { inspect } from 'node:util'
import type { Plugin } from 'vite'
import { unified } from 'unified'
import type { Node } from 'unist'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import type { VFile, Compatible as VFileCompatible } from 'vfile'
import { matter } from 'vfile-matter'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeRaw from 'rehype-raw'
import { read } from 'to-vfile'

import { remarkSmartypants } from './remarkSmartypants'
import { rehypeLazyImg } from './rehypeLazyImage'
import { rehypeFigure } from './rehypeFigure'
import { rehypeResponsiveImage } from './rehypeResponsiveImage'

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
	metadata: Record<string, Serializable>
	html: string
}

export interface IntermediateOutput {
	metadata: Record<string, Serializable>
	html: string
	replaceMap: Record<string, string>
	imports: string[]
}

const realLog = (item: any) => console.log(inspect(item, true, null, true))

const log = () => (tree: Node, file: VFile) => realLog({ tree, file })

const parseMatter =
	() =>
	(_: Node, file: VFile): void => {
		matter(file)
	}

const fileRegex = /\.md$/

export function remark(): Plugin {
	return {
		name: '',
		async transform(code, id) {
			if (!fileRegex.test(id)) return null

			const file = await read(id)
			const data = await compileMarkdownToJs(file)

			return {
				code: compileIntermediateToScript(data)
			}
		}
	}
}

const processor = unified()
	.use(remarkParse)
	.use(remarkFrontmatter, ['yaml'])
	.use(remarkMath, { singleDollarTextMath: false })
	.use(remarkSmartypants)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeKatex, { output: 'mathml' })
	.use(rehypeRaw)
	.use(rehypeHighlight, { aliases: { html: 'svelte' } })
	.use(rehypeResponsiveImage)
	.use(rehypeFigure)
	.use(rehypeLazyImg)
	.use(rehypeStringify)
	.use(parseMatter)

export const compileMarkdownToJs = async (
	fileData: VFileCompatible
): Promise<IntermediateOutput> => {
	const output = await processor.process(fileData)

	return {
		metadata: output.data.matter as Record<string, Serializable>,
		html: output.value as string,
		imports: output.data.imports as string[],
		replaceMap: output.data.replaceMap as Record<string, string>
	}
}

export const compileIntermediateToScript = (input: IntermediateOutput): string => {
	let output = input.imports.join('\n')
	output += '\n\n'

	const sanitisedHtml = input.html
		.replaceAll('\\', '\\\\')
		.replaceAll('`', '\\`')
		.replaceAll('$', '\\$')

	output += `const html = \``
	output += Object.entries(input.replaceMap).reduce(
		(acc, [rFrom, rTo]) => acc.replace(rFrom, `\${${rTo}}`),
		sanitisedHtml
	)

	output += '`\n'

	output += `const metadata = ${JSON.stringify(input.metadata)}\n`
	output += 'export default { html, metadata }\n'

	return output
}
