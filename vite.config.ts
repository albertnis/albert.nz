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
				// 480 - mobile and thumbnail
				// 768 - standard prose width
				// 1536 - standard width, 2x density
				// 2560 - max width
				w: '480;768;1536;2560',
				as: 'picture'
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
