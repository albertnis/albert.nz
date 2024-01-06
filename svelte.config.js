import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import rehypeFigure from 'rehype-figure'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { remarkKatexBlocks, correctHastTree } from './src/plugins/remark-katex-blocks/index.js'
import { rehypeLazyImg } from './src/plugins/rehype-plugin-lazy-img/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [relativeImages, remarkMath, remarkKatexBlocks],
			rehypePlugins: [correctHastTree, rehypeKatex, rehypeLazyImg, rehypeFigure]
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
		}
	}
}

export default config
