import { fetchMarkdownPosts } from '$lib/utils'
import {} from '@sveltejs/kit'
import { format, parseISO } from 'date-fns'
import type { PostWithContent } from '../../types/post'

export const GET = async () => {
	const posts = await fetchMarkdownPosts()

	const headers = {
		'Cache-Control': 'max-age=0,s-max-age=600',
		'Content-Type': 'application/xml'
	}
	const body = render(posts)
	return new Response(body, { headers })
}

const render = (
	posts: PostWithContent[]
) => `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Albert Nisbet - RSS Feed</title>
<description>The blog of Albert Nisbet</description>
<link>https://albert.nz</link>
<generator>GatsbyJS</generator>
<lastBuildDate>${formatRFC2822(new Date())}</lastBuildDate>
${posts.map(postToItem).join('\n')}
</channel>
</rss>`

const postToItem = (post: PostWithContent) => `<item>
<title>${post.meta.title}</title>
<description>${post.meta.description}</description>
<link>https://albert.nz${post.path}/</link>
<guid isPermaLink="false">${post.path}/</guid>
<pubDate>${formatRFC2822(parseISO(post.meta.date))}</pubDate>
<content:encoded>
<![CDATA[${transformRelativeLinksToAbsolute(post.contentHtml)}]]>
</content:encoded>
</item>`

const formatRFC2822 = (date: Date) => format(date, 'EEE, dd MMM yyyy HH:mm:ss O')

const transformRelativeLinksToAbsolute = (html: string) =>
	html.replaceAll(/(src|href)="(\/.+?)"/g, '$1="https://albert.nz$2"')
