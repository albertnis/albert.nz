import type { ViteGpxPluginOutput } from '../plugins/vite-plugin-gpx/types'

export interface PostMetadata {
	title: string
	description: string
	date: string
	accent: string
	links?: string[]
	routes?: string[]
	tags: string[]
}

export interface PostPreview {
	meta: PostMetadata
	path: string
}

export interface PostMapPreview {
	meta: PostMetadata
	geo: ViteGpxPluginOutput[]
	path: string
	imagesHtml: string[]
}

export interface Image {
	postSlug: string
	imageHtml: string
	tags: string[]
	aspectRatio: number
}

export interface PostWithContent {
	meta: PostMetadata
	path: string
	contentHtml: string
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
