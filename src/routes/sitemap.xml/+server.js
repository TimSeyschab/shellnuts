import { posts } from '$lib/data/posts';

const SITE_URL = 'https://shellnuts.de';
const POSTS_PER_PAGE = 10;

/**
 * @param {string} value
 */
const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

/**
 * @param {string} dateString
 */
const normalizePostDate = (dateString) => {
	const [day, month, year] = dateString.split('-');
	if (!day || !month || !year) {
		return undefined;
	}

	return `${year}-${month}-${day}`;
};

/**
 * @param {string} path
 * @param {string} [lastmod]
 */
const urlNode = (path, lastmod) => {
	const location = `${SITE_URL}${path}`;
	const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';

	return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmodTag}\n  </url>`;
};

/** @type {import('./$types').RequestHandler} */
export function GET() {
	const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
	const staticRoutes = ['/', '/about', '/blog'];
	const paginatedBlogRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => {
		const page = index + 2;
		return `/blog/${page}`;
	});
	const postRoutes = posts.map((post) => ({
		path: `/post/${post.slug}`,
		lastmod: post.date ? normalizePostDate(post.date) : undefined
	}));

	const urls = [
		...staticRoutes.map((path) => urlNode(path)),
		...paginatedBlogRoutes.map((path) => urlNode(path)),
		...postRoutes.map((entry) => urlNode(entry.path, entry.lastmod))
	].join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
}
