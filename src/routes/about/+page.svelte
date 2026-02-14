<script>
	import SeoHead from '$lib/components/SeoHead.svelte';

	const siteUrl = 'https://shellnuts.de';
	const pageTitle = 'About | Shellnuts';
	const pageDescription =
		'About Tim and Shellnuts: practical notes on Java, DevOps, observability, and upcoming IT security topics.';
	const canonicalUrl = `${siteUrl}/about`;
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: pageTitle,
		description: pageDescription,
		url: canonicalUrl
	};
</script>

<SeoHead
	title={pageTitle}
	description={pageDescription}
	{canonicalUrl}
	{siteUrl}
	jsonLd={structuredData}
/>

<section class="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
	<article
		class="prose lg:prose-xl rounded-box border border-base-300 bg-base-100 p-5 shadow-sm md:p-8"
	>
		<h1 class="text-2xl font-bold">About Shellnuts</h1>
		<p class="mt-4">Hi, I’m Tim, a full-stack developer based in Germany.</p>
		<p>
			Shellnuts is my place for practical notes from day-to-day implementation work. I mainly write
			about Java, DevOps, observability and the kind of migration/debugging topics that usually take
			longer than planned.
		</p>
		<p>
			The goal is simple: keep a reusable reference for future projects and share things I would
			have liked to read before starting similar tasks.
		</p>
		<p>
			This year, I plan to publish more regularly, with a stronger focus on IT security topics
			alongside Java, DevOps and observability.
		</p>
	</article>
</section>
