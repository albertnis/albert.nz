// Based on https://github.com/mattjennings/mdsvex-relative-images

import { visit } from 'unist-util-visit'

const toCamel = (input) => input.replace(/[^0-9a-zA-Z]/g, '')

export const imagetoolsSrcset = () => {
	return function transformer(tree) {
		const urls = new Map()
		const url_count = new Map()

		function transformUrl(url) {
			url = decodeURIComponent(url)

			if (url.startsWith('.')) {
				// filenames can start with digits,
				// prepend underscore to guarantee valid module name
				let camel = `_${toCamel(url)}`
				const count = url_count.get(camel)
				const dupe = urls.get(url)

				if (count && !dupe) {
					url_count.set(camel, count + 1)
					camel = `${camel}_${count}`
				} else if (!dupe) {
					url_count.set(camel, 1)
				}

				urls.set(url, {
					path: url,
					id: camel
				})

				return camel
			}

			return url
		}

		// transform src in html nodes
		visit(tree, { tagName: 'img' }, (node) => {
			const url = node.properties?.src
			if (url) {
				const transformed = transformUrl(url)
				node.type = 'raw'
				node.value = `<Picture data={${transformed}} imgAttributes={${JSON.stringify(
					node.properties
				)}} />`
			}
		})

		let scripts = ''
		urls.forEach((x) => (scripts += `import ${x.id} from "${x.path}";\n`))

		if (scripts.length > 0) {
			scripts = `import Picture from "$lib/components/Picture.svelte"\n` + scripts
			tree.children.push({
				type: 'element',
				tagName: 'script',
				properties: {},
				children: [
					{
						type: 'text',
						value: scripts
					}
				]
			})
		}
	}
}
