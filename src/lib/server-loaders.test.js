import { describe, expect, it } from 'vitest';
import { posts } from '$lib/data/posts';
import { load as loadHome } from '../routes/+page.server.js';
import { load as loadBlog } from '../routes/blog/[[page]]/+page.server.js';
import { load as loadPost } from '../routes/post/[slug]/+page.server.js';

describe('server loaders', () => {
	it('home loader returns at most three latest posts', async () => {
		const load = /** @type {any} */ (loadHome);
		const data = await load({});

		expect(data.latestPosts).toHaveLength(Math.min(3, posts.length));
		expect(data.latestPosts).toEqual(posts.slice(0, 3));
	});

	it('blog loader paginates first page', async () => {
		const load = /** @type {any} */ (loadBlog);
		const data = await load({ params: {} });

		expect(data.page).toBe(1);
		expect(data.limit).toBe(10);
		expect(data.totalPages).toBe(Math.max(1, Math.ceil(posts.length / 10)));
		expect(data.hasPreviousPage).toBe(false);
		expect(data.hasNextPage).toBe(false);
		expect(data.posts).toEqual(posts.slice(0, 10));
	});

	it('blog loader throws 404 for invalid page', async () => {
		const load = /** @type {any} */ (loadBlog);
		await expect(load({ params: { page: '0' } })).rejects.toMatchObject({ status: 404 });
		await expect(load({ params: { page: 'not-a-number' } })).rejects.toMatchObject({
			status: 404
		});
		await expect(load({ params: { page: '999' } })).rejects.toMatchObject({ status: 404 });
	});

	it('post loader resolves known slug', async () => {
		const load = /** @type {any} */ (loadPost);
		const knownSlug = posts[0]?.slug;
		expect(knownSlug).toBeTruthy();

		const data = await load({ params: { slug: knownSlug } });
		expect(data.post.slug).toBe(knownSlug);
	});

	it('post loader throws 404 for unknown slugs', async () => {
		const load = /** @type {any} */ (loadPost);
		await expect(load({ params: { slug: 'definitely-not-existing-post' } })).rejects.toMatchObject({
			status: 404
		});
	});
});
