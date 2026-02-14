<script>
	import PostsList from '$lib/components/PostList.svelte';
	import { resolve } from '$app/paths';

	/**
	 * @typedef {Object} Props
	 * @property {any} data
	 */

	/** @type {Props} */
	let { data } = $props();
</script>

<section class="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
	<div class="mb-8 space-y-2 md:mb-10">
		<h1 class="text-1xl font-bold tracking-tight md:text-4xl">
			Writing about Java hacks, DevOps adventures and culinary experiments 👨‍💻
		</h1>
		<p class="text-base-content/70">
			Implementation notes, debugging war stories and practical setups I can reuse.
		</p>
	</div>

	<div class="space-y-6">
		<PostsList posts={data.posts} />
	</div>

	{#if data.totalPages > 1}
		<nav class="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
			{#if data.hasPreviousPage}
				<a
					class="btn btn-outline btn-sm"
					href={resolve(data.page - 1 === 1 ? '/blog' : `/blog/${data.page - 1}`)}
				>
					Previous
				</a>
			{/if}

			<span class="text-sm text-base-content/70">Page {data.page} of {data.totalPages}</span>

			{#if data.hasNextPage}
				<a class="btn btn-outline btn-sm" href={resolve(`/blog/${data.page + 1}`)}>Next</a>
			{/if}
		</nav>
	{/if}
</section>
