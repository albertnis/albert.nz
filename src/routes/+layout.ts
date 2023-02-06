import type { PageData } from '../types/post'

export const prerender = true

export const load = (): PageData => ({
	title: 'Albert Nisbet',
	description:
		'Christchurch-based software developer writing about web development, electronics, and the New Zealand outdoors.'
})
