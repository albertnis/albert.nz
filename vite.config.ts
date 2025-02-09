import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
import { gpxPlugin } from './src/plugins/vite-plugin-gpx'
import { imagetools } from 'vite-imagetools'
import { remark } from './src/plugins/vite-plugin-remark'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())

	return {
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
					as: 'metadata'
				})
			}),
			remark({
				immichApiKey: env.VITE_IMMICH_API_KEY,
				immichAllowedHosts: ['photos.albert.nz']
			})
		],
		server: {
			fs: {
				allow: ['src', 'content']
			}
		},
		assetsInclude: ['**/*.JPG']
	}
})
