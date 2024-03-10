import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ request }) => {
	const country = request.headers.get('CF-IPCountry')

	return {
		country
	}
}
