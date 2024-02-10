import type { Image } from '../../types/post'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`api/images`)
	const images = (await response.json()) as Image[]

	return {
		images,
		title: 'Gallery | Albert Nisbet',
		description: 'Gallery of images, most of which are from hikes in New Zealand'
	}
}
