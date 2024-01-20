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
				// 480 - mobile
				// 780 - standard prose width
				// 2560 - fullscreen width
				w: '480;780;2560',
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
