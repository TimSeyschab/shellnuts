<script>
	import PostsList from '$lib/components/PostList.svelte';

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
</section>
