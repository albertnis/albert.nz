import { describe, it, expect } from 'vitest'
import { compileIntermediateToScript, compileMarkdownToJs, type IntermediateOutput } from '.'
import { VFile } from 'vfile'
import path from 'node:path'

describe('when the markdown is simple', () => {
	const data = `Hello **world**`

	it('outputs the expected HTML', async () => {
		const output = await compileMarkdownToJs(data)
		expect(output.html).toEqual('<p>Hello <strong>world</strong></p>')
	})
})

describe('when the markdown contains dashes', () => {
	const data = `Hello--world`

	it('improves the dashes using smartypants', async () => {
		const output = await compileMarkdownToJs(data)
		expect(output.html).toEqual('<p>Hello—world</p>')
	})
})

describe('when the markdown contains math', () => {
	it('converts the math to MathML', async () => {
		const data = `My variable $$L$$`
		const output = await compileMarkdownToJs(data)
		expect(output.html).toEqual(
			'<p>My variable <span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>L</mi></mrow><annotation encoding="application/x-tex">L</annotation></semantics></math></span></p>'
		)
	})
})

describe('when the markdown contains frontmatter', () => {
	const data = `---
title: me and you
amount: 3
---

Content
  `

	it('includes the data in the output', async () => {
		const output = await compileMarkdownToJs(data)
		expect(output.metadata).toEqual({ title: 'me and you', amount: 3 })
		expect(output.html).toEqual('<p>Content</p>')
	})
})

describe('when the markdown contains an image', () => {
	const dataMd = ['markdown', '![](image.jpg)']
	const dataHtml = ['html', '<img src="image.jpg" />']

	describe.each([dataMd, dataHtml])('and the syntax is %s', (_, data) => {
		it('makes the image lazy in the output', async (_) => {
			const output = await compileMarkdownToJs(data)
			expect(output.html).toContain('loading="lazy"')
		})
	})
})

describe('when the markdown contains an image with alt text', () => {
	const dataMd = ['markdown', '![alt](image.jpg)']
	const dataHtml = ['html', '<img src="image.jpg" alt="alt" />']

	describe.each([dataMd, dataHtml])('and the syntax is %s', (_, data) => {
		it('adds a figure with caption', async () => {
			const output = await compileMarkdownToJs(data)
			expect(output.html).toContain('<figure>')
			expect(output.html).toContain('<figcaption>alt</figcaption>')
		})
	})
})

describe('when the markdown contains an image without alt text', () => {
	const dataMd = ['markdown', '![](image.jpg)']
	const dataHtml = ['html', '<img src="image.jpg" alt="" />']

	describe.each([dataMd, dataHtml])('and the syntax is %s', (_, data) => {
		it('does not add a figure or caption', async () => {
			const output = await compileMarkdownToJs(data)
			expect(output.html).not.toContain('<figure>')
			expect(output.html).not.toContain('<figcaption>')
		})
	})
})

describe('when the markdown contains a relative image', () => {
	const fakeCwd = path.join(__dirname, '../../../content/blog/taipo')
	const dataMd = ['markdown', '![](./DSC08233.jpg)']
	const dataHtml = ['html', '<img src="./DSC08233.jpg" />']

	describe.each([dataMd, dataHtml])('and the syntax is %s', (_, data) => {
		it('makes the image responsive', async () => {
			const output = await compileMarkdownToJs(
				new VFile({
					value: data,
					cwd: fakeCwd,
					path: path.join(fakeCwd, 'index.md')
				})
			)

			expect(output.html).toContain('srcset=')
			expect(output.html).toContain('sizes=')
			expect(output.html).toContain('aspect-ratio')
		})
	})
})

describe('compiling a script', () => {
	it('compiles as expected', () => {
		const intermediate: IntermediateOutput = {
			html: '<img src="SUB-A" style="aspect-ratio: SUB-B;">`backticks`',
			metadata: { hi: 'there' },
			imports: ['import thing from "that"', 'import me from "you"'],
			replaceMap: {
				'SUB-A': 'thing',
				'SUB-B': 'me'
			}
		}

		const output = compileIntermediateToScript(intermediate)

		expect(output).toEqual(`import thing from "that"
import me from "you"

const html = \`<img src="\${thing}" style="aspect-ratio: \${me};">\\\`backticks\\\`\`
const metadata = {"hi":"there"}
export default { html, metadata }
`)
	})
})
