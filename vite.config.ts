import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['src', 'content']
		}
	},
	assetsInclude: ['**/*.JPG']
}

export default config
