import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { Element } from 'hast'
import type { VFile } from 'vfile'
import path from 'node:path'
import fs from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

const processImmichImageNode = async (
	node: Element,
	file: VFile,
	immichApiKey?: string
): Promise<void> => {
	// Download file
	const src = node.properties.src as string

	if (file.dirname == null) {
		throw new Error(`File has no path`)
	}

	if (immichApiKey == null) {
		throw new Error('No Immich API key configured')
	}

	const resp = await fetch(src, {
		method: 'HEAD',
		headers: { 'x-api-key': immichApiKey }
	})

	if (!resp.ok) {
		throw new Error('Imimch request failed')
	}

	const etag = resp.headers.get('etag')

	if (etag == null) {
		throw new Error('Immich provided no etag')
	}

	const etagContent = etag.match(/^(?:W\/)?"([^"]+)"$/)?.[1]

	if (etagContent == null) {
		throw new Error('Could not parse etag')
	}

	const cacheDir = path.resolve('.cache', 'remote-assets')

	if (!fs.existsSync(cacheDir)) {
		await mkdir(cacheDir, { recursive: true })
	}

	const etagCacheDir = path.resolve(cacheDir, etagContent)

	let cachedFileName
	try {
		cachedFileName = path.join(etagCacheDir, fs.readdirSync(etagCacheDir)[0])
	} catch {
		cachedFileName = undefined
	}

	if (cachedFileName != null) {
		console.debug(`Skipping fetch of ${src} as version ${etagContent} is already cached`)
	} else {
		await mkdir(etagCacheDir)

		const info = await fetch(src.slice(0, -9), {
			method: 'GET',
			headers: { 'x-api-key': immichApiKey }
		})

		const originalFileName = (await info.json()).originalFileName
		if (typeof originalFileName !== 'string') {
			throw new Error('Could not retrieve original file name from Immich')
		}

		const resp = await fetch(src, {
			method: 'GET',
			headers: { 'x-api-key': immichApiKey }
		})

		if (resp.body == null) {
			throw new Error('No image data sent from server')
		}

		cachedFileName = path.resolve(etagCacheDir, originalFileName)

		const stream = fs.createWriteStream(cachedFileName, { flags: 'wx' })
		await finished(Readable.fromWeb(resp.body as import('stream/web').ReadableStream).pipe(stream))
	}

	node.properties.src = path.relative(file.dirname, cachedFileName)
}

interface Options {
	apiKey?: string
	allowedHosts: string[]
}

export const rehypeImmich = (options: Options | null | undefined) => {
	if (options == null) {
		throw new Error('Options are required')
	}
	const { allowedHosts, apiKey } = options

	return async (tree: Node, file: VFile) => {
		const promises: Promise<void>[] = []
		const nodes: Element[] = []

		visit(tree, isImmichImage(allowedHosts), (n: Node) => {
			const node = n as Element
			nodes.push(node)
		})

		for (const node of nodes) {
			promises.push(processImmichImageNode(node, file, apiKey))
		}

		await Promise.all(promises)
	}
}

const isImmichImage =
	(allowedHosts: string[]) =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(node: any): node is Element => {
		if (node.type !== 'element' || node?.properties?.src == null) {
			return false
		}

		let url
		try {
			url = new URL(node.properties.src)
		} catch {
			return false
		}

		if (!allowedHosts.includes(url.hostname)) {
			return false
		}

		if (url.protocol !== 'https:') {
			return false
		}

		return url.pathname.match(/api\/assets\/([0-9a-z-]+)\/original/) != null
	}
