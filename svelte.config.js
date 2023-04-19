import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import rehypeFigure from 'rehype-figure'
import { rehypeLazyImg } from './plugins/rehype-plugin-lazy-img/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [relativeImages],
			rehypePlugins: [rehypeLazyImg, rehypeFigure]
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
			entries: ['/', '/rss.xml']
		}
	}
}

export default config
