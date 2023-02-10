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
}

export interface PostWithContent {
	meta: PostMetadata
	path: string
	contentHtml: string
}

export interface Post {
	meta: PostMetadata
	getGeo: () => Promise<ViteGpxPluginOutput[]>
	content: any
}

export type PageData<T = unknown> = T & {
	title: string
	description: string
}
