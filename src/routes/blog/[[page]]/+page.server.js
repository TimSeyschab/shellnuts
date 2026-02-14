import { posts } from '$lib/data/posts';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const page = params.page ? Number.parseInt(params.page, 10) : 1;
	const limit = 10;
	const totalPosts = posts.length;
	const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

	if (!Number.isInteger(page) || page < 1 || page > totalPages) {
		throw error(404, 'Page not found');
	}

	const offset = (page - 1) * limit;
	const pagedPosts = posts.slice(offset, offset + limit);

	return {
		posts: pagedPosts,
		page,
		limit,
		totalPages,
		hasPreviousPage: page > 1,
		hasNextPage: page < totalPages
	};
}
