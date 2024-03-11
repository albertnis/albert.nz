import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	extensions: ['.svelte'],

	kit: {
		adapter: adapter({
			routes: {
				include: ['/'],
				exclude: []
			}
		}),
		prerender: {
			entries: ['/', '/rss.xml', '/404', '/adventures', '/gallery']
		},
		paths: {
			assets: process.env.CF_PAGES_URL,
			relative: process.env.CF_PAGES_URL == null
		}
	}
}

export default config
