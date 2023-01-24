export interface PostMetadata {
	title: string
	description: string
	date: string
	accent: string
	links: string[]
}

export interface PostPreview {
	meta: PostMetadata
	path: string
}

export interface Post {
	meta: PostMetadata
	content: any
}
