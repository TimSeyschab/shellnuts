<script>
	import PostNav from '$lib/components/ContentNav.svelte';

	
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();
	const website = 'https://shellnuts.de';
	const url = `${website}/post/${data.post.slug}`;
	// generated open-graph image for sharing on social media.
	// see https://og-image.vercel.app/ for more options.
	const ogImage = `https://og-image.vercel.app/**${encodeURIComponent(
		data.post.title
	)}**?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-color-logo.svg`;
</script>

<svelte:head>
	<title>{data.post.title} - Tim</title>
	<meta name="description" content={data.post.preview.text} />
	<meta name="author" content=Tim />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.preview.text} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={website} />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.preview.text} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="h-screen">
	<div class="flex justify-center">
		<article class="prose lg:prose-xl rounded-xl overflow-hidden p-3 mb-20">
			<h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
				{data.post.title}
			</h1>
			<!-- render the post -->
			<data.component />
		</article>

		<div class="hidden md:block ml-8">
			<aside class="sticky top-10" aria-label="Table of Contents">
				<PostNav post={data.post} />
			</aside>
		</div>
	</div>
</div>