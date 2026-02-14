import { posts } from '$lib/data/posts';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		latestPosts: posts.slice(0, 3)
	};
}
