import { browser } from '$app/environment';
import { format } from 'date-fns';
import { parse } from 'node-html-parser';
import { render } from 'svelte/server';

/**
 * @typedef {Object} PostMetadata
 * @property {string} [title]
 * @property {string} [date]
 * @property {string} [preview]
 * @property {Array<{ id: string, value: string }>} [headings]
 */

/**
 * @typedef {Object} PostModule
 * @property {import('svelte').Component<any>} default
 * @property {PostMetadata} metadata
 */

// we require some server-side APIs to parse all metadata
if (browser) {
	throw new Error(`posts can only be imported server-side`);
}

/** @type {Array<[string, PostModule]>} */
const postEntries = Object.entries(
	/** @type {Record<string, PostModule>} */ (import.meta.glob('/posts/**/*.md', { eager: true }))
);

// Get all posts and add metadata
export const posts = postEntries
	.map(([filepath, post]) => {
		const metadata = post.metadata ?? {};
		const parsedDate = metadata.date ? new Date(metadata.date) : undefined;
		const sortDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getTime() : 0;
		const html = parse(render(post.default).body);
		const preview = metadata.preview ? parse(metadata.preview) : (html.querySelector('p') ?? html);
		const previewHtml = preview.toString();
		const slug =
			filepath
				.replace(/(\/index)?\.md/, '')
				.split('/')
				.pop() ?? '';

		return {
			...metadata,
			slug,
			isIndexFile: filepath.endsWith('/index.md'),
			date: parsedDate ? format(parsedDate, 'dd-MM-yyyy') : undefined,
			preview: {
				html: previewHtml,
				text: preview.structuredText ?? previewHtml
			},
			title: metadata.title ?? slug,
			_sortDate: sortDate
		};
	})
	// sort by date
	.sort((a, b) => b._sortDate - a._sortDate)
	// add references to the next/previous post
	.map((post, index, allPosts) => {
		const nextPost = allPosts[index - 1];
		const previousPost = allPosts[index + 1];
		const { _sortDate: currentSortDate, ...current } = post;
		void currentSortDate;
		const next = nextPost
			? (({ _sortDate: nextSortDate, ...nextData }) => {
					void nextSortDate;
					return nextData;
				})(nextPost)
			: undefined;
		const previous = previousPost
			? (({ _sortDate: previousSortDate, ...previousData }) => {
					void previousSortDate;
					return previousData;
				})(previousPost)
			: undefined;

		return {
			...current,
			next,
			previous
		};
	});
