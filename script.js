const typoConfig = [
	'h1',
	'h2',
	'h3',
	'h4',
	'p',
	'blockquote',
	'figure',
	'figcaption',
	'pre',
	'ol',
	'ul',
	'table',
	'thead',
	'img',
	'video',
	'hr'
].reduce(
	(acc, x) => ({
		...acc,
		[x]: {
			'grid-column-start': 'prose-start',
			'grid-column-end': 'prose-end'
		}
	}),
	{}
)

console.log(JSON.stringify(typoConfig))
