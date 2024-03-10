import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ request }) => {
	const country = (request as any).cf?.country as string | undefined

	return {
		country
	}
}
