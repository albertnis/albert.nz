import type { ViteGpxPluginOutput } from '../../plugins/vite-plugin-gpx/types'

export interface PostMetadata {
	title: string
	description: string
	date: string
	accent: string
	links?: string[]
	routes?: string[]
}

export interface PostPreview {
	meta: PostMetadata
	path: string
	content: string
}

export interface Post {
	meta: PostMetadata
	geo: ViteGpxPluginOutput[]
	content: any
}

export type PageData<T = unknown> = T & {
	title: string
	description: string
}
