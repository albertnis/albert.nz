import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import { gpxPlugin } from './plugins/vite-plugin-gpx'

const config: UserConfig = {
	plugins: [sveltekit(), gpxPlugin({})],
	server: {
		fs: {
			allow: ['src', 'content']
		}
	},
	assetsInclude: ['**/*.JPG']
}

export default config
