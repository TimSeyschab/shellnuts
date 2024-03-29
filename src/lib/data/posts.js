import { browser } from '$app/environment';
import { format } from 'date-fns';
import { parse } from 'node-html-parser'

// we require some server-side APIs to parse all metadata
if (browser) {
	throw new Error(`posts can only be imported server-side`);
}

// Get all posts and add metadata
export const posts = Object.entries(import.meta.glob('/posts/**/*.md', { eager: true }))
	.map(([filepath, post]) => {
		const html = parse(post.default.render().html)
		const preview = post.metadata.preview ? parse(post.metadata.preview) : html.querySelector('p')

		return {
			...post.metadata,
			slug: filepath
				.replace(/(\/index)?\.md/, '')
				.split('/')
				.pop(),
			isIndexFile: filepath.endsWith('/index.md'),
			date: post.metadata.date
				? format(new Date(post.metadata.date), 'dd-MM-yyyy') : undefined,
			preview: {
				html: preview.toString(),
				text: preview.structuredText ?? preview.toString()
			},
			title: post.metadata.title
		};
	})
	// sort by date
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	// add references to the next/previous post
	.map((post, index, allPosts) => ({
		...post,
		next: allPosts[index - 1],
		previous: allPosts[index + 1]
	}));