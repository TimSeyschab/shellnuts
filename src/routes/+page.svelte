<script>
	import { resolve } from '$app/paths';
	import PostList from '$lib/components/PostList.svelte';
	/** @type {{ data: { latestPosts: Array<{ slug: string, title: string, date?: string, preview: { text: string } }> } }} */
	let { data } = $props();

	const wait = () => new Promise((res) => setTimeout(res, 1000));
	let stageOne = $state(false);

	/**
	 * Custom Svelte transition for typewriter effect on text nodes.
	 * @param {HTMLElement} node - The element to apply the transition to.
	 * @throws {Error} Throws an error if the element does not have a single text node child.
	 * @returns {Object} The transition object.
	 */
	function typewriter(node) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent || '';
		const duration = text.length / 0.01;
		const tick = /** @param {number} t */ (t) => {
			const i = ~~(text.length * t);
			node.textContent = text.slice(0, i);
		};

		return {
			duration,
			tick
		};
	}
</script>

<section class="hero min-h-[75vh]">
	<div class="hero-content w-full max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-start">
		<div class="max-w-2xl space-y-5">
			<p class="badge badge-outline">Shellnuts</p>
			<h1 class="text-4xl font-bold leading-tight md:text-5xl">
				Java hacks, observability rabbit holes and the occasional kitchen experiment.
			</h1>
			<p class="text-base-content/70 text-lg">
				Real notes from real implementation sessions. No theory theater, just what worked and what
				wasted an afternoon.
			</p>
			<div class="flex flex-wrap gap-3">
				<a class="btn btn-primary" href={resolve('/blog')}>Read the Blog</a>
				<a class="btn btn-ghost" href={resolve('/about')}>About</a>
			</div>
		</div>
		<div
			id="animation-shell"
			class="hidden w-full max-w-xl rounded-box border border-base-300 bg-base-100 shadow-xl md:block"
		>
			{#await wait()}
				<div class="flex h-40 items-center justify-center">
					<span class="loading loading-spinner text-secondary w-12">Loading</span>
				</div>
			{:then}
				<div class="mockup-code bg-neutral text-neutral-content shadow-md">
					<pre data-prefix="λ"><code
							class="text-zinc-100"
							transition:typewriter
							onintroend={() => (stageOne = true)}>npm install -g shellnuts</code
						></pre>
					{#if stageOne === true}
						<pre data-prefix="λ"><code class="text-emerald-200"
								>up to date, audited 1 package in 1s</code
							></pre>
						<pre data-prefix="λ"><code class="text-emerald-200"
								>Check out the <a class="link-accent underline" href={resolve('/blog')}>blog</a
								> 🤖</code
							></pre>
					{/if}
				</div>
			{/await}
		</div>
	</div>
</section>

<section class="mx-auto w-full max-w-6xl px-4 pb-16 md:pb-24">
	<div class="mb-6 flex items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-bold md:text-3xl">Latest Posts</h2>
			<p class="text-base-content/70">Fresh notes from recent implementation sessions.</p>
		</div>
		<a class="btn btn-outline btn-sm md:btn-md" href={resolve('/blog')}>See all</a>
	</div>

	<div class="space-y-6">
		<PostList posts={data.latestPosts} />
	</div>
</section>
