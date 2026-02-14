<script>
	import PostNav from '$lib/components/ContentNav.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();
	const siteUrl = 'https://shellnuts.de';
	const authorName = 'Tim';
	const url = $derived(`${siteUrl}/post/${data.post.slug}`);
	const canonicalUrl = $derived(url);
	const isoPublishedDate = $derived.by(() => {
		if (!data.post.date) {
			return undefined;
		}

		const [day, month, year] = data.post.date.split('-');
		if (!day || !month || !year) {
			return undefined;
		}

		return `${year}-${month}-${day}`;
	});
	// generated open-graph image for sharing on social media.
	// see https://og-image.vercel.app/ for more options.
	const ogImage = $derived(
		`https://og-image.vercel.app/**${encodeURIComponent(
			data.post.title
		)}**?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-color-logo.svg`
	);
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.post.title,
		description: data.post.preview.text,
		url: canonicalUrl,
		mainEntityOfPage: canonicalUrl,
		image: ogImage,
		author: {
			'@type': 'Person',
			name: authorName
		},
		publisher: {
			'@type': 'Person',
			name: authorName
		},
		datePublished: isoPublishedDate,
		dateModified: isoPublishedDate
	});
</script>

<SeoHead
	title={`${data.post.title} - ${authorName}`}
	description={data.post.preview.text}
	{canonicalUrl}
	{siteUrl}
	ogType="article"
	{ogImage}
	jsonLd={structuredData}
	author={authorName}
/>

<svelte:head>
	{#if isoPublishedDate}
		<meta property="article:published_time" content={isoPublishedDate} />
	{/if}
	<meta property="article:author" content={authorName} />
	<meta property="twitter:domain" content={siteUrl} />
</svelte:head>

<section class="mx-auto flex w-full max-w-6xl justify-center gap-8 px-4 pb-20">
	<article class="prose lg:prose-xl w-full overflow-hidden p-3">
		<h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
			{data.post.title}
		</h1>
		<!-- render the post -->
		<data.component />
	</article>

	{#if data.post.headings?.length}
		<div class="ml-8 hidden md:block">
			<aside class="sticky top-10" aria-label="Table of Contents">
				<PostNav post={data.post} />
			</aside>
		</div>
	{/if}
</section>
