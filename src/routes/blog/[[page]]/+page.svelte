<script>
	import PostsList from '$lib/components/PostList.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { resolve } from '$app/paths';

	/**
	 * @typedef {Object} Props
	 * @property {{
	 *   page: number,
	 *   limit: number,
	 *   totalPages: number,
	 *   hasPreviousPage: boolean,
	 *   hasNextPage: boolean,
	 *   posts: Array<{ slug: string, title: string }>
	 * }} data
	 */

	/** @type {Props} */
	let { data } = $props();
	const siteUrl = 'https://shellnuts.de';
	const pageDescription =
		'Implementation notes, debugging stories and practical setup guides from real project sessions.';
	const pageTitle = $derived(
		data.page > 1
			? `Shellnuts Blog - Page ${data.page} | Java, DevOps, Observability`
			: 'Shellnuts Blog | Java, DevOps, Observability'
	);
	const canonicalUrl = $derived(data.page > 1 ? `${siteUrl}/blog/${data.page}` : `${siteUrl}/blog`);
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: pageTitle,
		description: pageDescription,
		url: canonicalUrl,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data.posts.map((post, index) => ({
				'@type': 'ListItem',
				position: index + 1 + (data.page - 1) * data.limit,
				url: `${siteUrl}/post/${post.slug}`,
				name: post.title
			}))
		}
	});
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	{canonicalUrl}
	{siteUrl}
	jsonLd={structuredData}
/>

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
