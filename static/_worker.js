const stringsByCountry = {
	NZ: {
		'home.greeting': 'Kia ora',
		'home.city': 'Ōtautahi Christchurch'
	}
}

class ElementHandler {
	constructor(countryStrings) {
		this.countryStrings = countryStrings
	}

	element(element) {
		const i18nKey = element.getAttribute('data-i18n')
		if (i18nKey) {
			const translation = this.countryStrings[i18nKey]
			if (translation) {
				element.setInnerContent(translation)
			}
		}
	}
}

/** @type {import("@cloudflare/workers-types").Fetcher} */
export default {
	async fetch(request, env) {
		const country = request.headers.get('Country') ?? request.cf.country
		const countryStrings = stringsByCountry[country]

		const response = await env.ASSETS.fetch(request)

		if (countryStrings !== undefined) {
			return new HTMLRewriter()
				.on('[data-i18n]', new ElementHandler(countryStrings))
				.transform(response)
		}

		return response
	}
}
