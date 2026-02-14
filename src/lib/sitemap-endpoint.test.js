import { describe, expect, it } from 'vitest';
import { GET } from '../routes/sitemap.xml/+server.js';
import { posts } from '$lib/data/posts';

describe('sitemap endpoint', () => {
	it('returns XML sitemap with core routes and posts', async () => {
		const response = GET();
		const body = await response.text();

		expect(response.headers.get('content-type')).toContain('application/xml');
		expect(body).toContain('<urlset');
		expect(body).toContain('<loc>https://shellnuts.de/</loc>');
		expect(body).toContain('<loc>https://shellnuts.de/about</loc>');
		expect(body).toContain('<loc>https://shellnuts.de/blog</loc>');

		const firstPostSlug = posts[0]?.slug;
		expect(firstPostSlug).toBeTruthy();
		expect(body).toContain(`<loc>https://shellnuts.de/post/${firstPostSlug}</loc>`);
	});
});
