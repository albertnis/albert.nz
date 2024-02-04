import { parse } from 'node-html-parser'

const articleSizesNormal = '(max-width: 480px) 480px, 768px'
const articleSizesWide = '(max-width: 480px) 480px, (max-width: 768px) 768px, 2560px'

export const updateSizesForArticle = (html: string): string => {
	const dom = parse(html)
	dom
		.getElementsByTagName('img')
		.forEach((el) =>
			el.setAttribute(
				'sizes',
				el.classList.contains('prose-custom-w-full') ? articleSizesWide : articleSizesNormal
			)
		)
	return dom.toString()
}

export const updateSizesForAdventuresThumbnail = (html: string): string => {
	const dom = parse(html)
	dom.getElementsByTagName('img').forEach((el) => el.setAttribute('sizes', '480px'))
	return dom.toString()
}
