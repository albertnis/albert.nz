import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import { rehypeLazyImg } from './plugins/rehype-plugin-lazy-img/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [relativeImages],
			rehypePlugins: [rehypeLazyImg]
		}),
		vitePreprocess()
	],

	extensions: ['.svelte', '.md', '.svx'],

	kit: {
		adapter: adapter()
	}
}

export default config