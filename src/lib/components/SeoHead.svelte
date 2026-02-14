<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} title
	 * @property {string} description
	 * @property {string} canonicalUrl
	 * @property {string} [siteUrl]
	 * @property {string} [siteName]
	 * @property {'website' | 'article'} [ogType]
	 * @property {string} [ogImage]
	 * @property {string} [twitterCard]
	 * @property {Record<string, any>} [jsonLd]
	 * @property {string} [author]
	 */
	/** @type {Props} */
	let {
		title,
		description,
		canonicalUrl,
		siteUrl = 'https://shellnuts.de',
		siteName = 'Shellnuts',
		ogType = 'website',
		ogImage,
		twitterCard = 'summary_large_image',
		jsonLd,
		author
	} = $props();

	const resolvedOgImage = $derived(ogImage ?? `${siteUrl}/favicon.png`);
	const jsonLdScript = $derived.by(() => {
		if (!jsonLd) {
			return '';
		}

		const safeJson = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
		return `<script type="application/ld+json">${safeJson}<\/script>`;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	{#if author}
		<meta name="author" content={author} />
	{/if}

	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={resolvedOgImage} />

	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={resolvedOgImage} />
	<meta property="twitter:url" content={canonicalUrl} />

	{#if jsonLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdScript}
	{/if}
</svelte:head>
