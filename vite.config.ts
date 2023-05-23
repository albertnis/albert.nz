import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import { gpxPlugin } from './src/plugins/vite-plugin-gpx'
import { imagetools } from 'vite-imagetools'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		gpxPlugin(),
		imagetools({
			defaultDirectives: new URLSearchParams({
				format: 'webp',
				withoutEnlargement: 'true',
				width: '2000'
			})
		})
	],
	server: {
		fs: {
			allow: ['src', 'content']
		}
	},
	assetsInclude: ['**/*.JPG']
}

export default config
