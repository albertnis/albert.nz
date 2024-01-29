import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import { imagetoolsSrcset } from './src/plugins/rehype-plugin-imagetools-srcset/index.js'
import rehypeFigure from '@microflash/rehype-figure'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { remarkKatexBlocks, correctHastTree } from './src/plugins/remark-katex-blocks/index.js'
import { rehypeLazyImg } from './src/plugins/rehype-plugin-lazy-img/index.js'
import { parseRawImg } from './src/plugins/rehype-plugin-parse-raw-img/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [remarkMath, remarkKatexBlocks],
			rehypePlugins: [
				correctHastTree,
				rehypeKatex,
				parseRawImg,
				rehypeLazyImg,
				rehypeFigure,
				imagetoolsSrcset
			]
		}),
		vitePreprocess()
	],

	extensions: ['.svelte', '.md', '.svx'],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			strict: false
		}),
		prerender: {
			entries: ['/', '/rss.xml', '/404']
		},
		paths: {
			assets: process.env.CF_PAGES_URL,
			relative: process.env.CF_PAGES_URL == null
		}
	}
}

export default config
