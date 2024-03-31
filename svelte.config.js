import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	extensions: ['.svelte'],

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
