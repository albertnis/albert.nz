const stringsByCountry = {
	NZ: {
		'home.greeting': 'Kia ora!'
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

export default {
	async fetch(request, env) {
		const url = new URL(request.url)
		const country = request.cf.country
		const countryStrings = stringsByCountry[country]

		const response = env.ASSETS.fetch(request)

		if (countryStrings !== undefined) {
			return new HTMLRewriter()
				.on('[data-i18n]', new ElementHandler(countryStrings))
				.transform(response)
		}

		return env.ASSETS.fetch(request)
	}
}
