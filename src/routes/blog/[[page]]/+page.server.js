import { posts } from '$lib/data/posts'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	let page = params.page ? parseInt(params.page) : 1
	let limit = 10

	return {
		posts,
		page,
		limit
	}
}