<script>
	/**
	 * @typedef {{ id: string, value: string }} Heading
	 * @typedef {Object} Props
	 * @property {{ headings?: Heading[] }} post
	 */

	/** @type {Props} */
	let { post } = $props();

	let headings = $derived(post.headings ?? []);
	let elements = $derived.by(() => {
		if (typeof document === 'undefined') {
			return [];
		}

		return headings.map((heading) => document.getElementById(heading.id));
	});
	/** @type {string | undefined} */ let activeHeadingId = $state();

	$effect(() => {
		// Re-evaluate active heading when article headings/elements change.
		if (headings.length === 0) {
			activeHeadingId = undefined;
			return;
		}

		setActiveHeading();
	});

	function setActiveHeading() {
		if (typeof window === 'undefined' || headings.length === 0) {
			return;
		}

		const scrollY = window.scrollY;

		const visibleIndex =
			elements.findIndex(
				(element) => element && element.offsetTop + element.clientHeight > scrollY
			) - 1;
		let nextActiveId = headings[visibleIndex]?.id;

		const pageHeight = document.body.scrollHeight || 1;
		const scrollProgress = (scrollY + window.innerHeight) / pageHeight;

		if (!nextActiveId) {
			if (scrollProgress > 0.5) {
				nextActiveId = headings[headings.length - 1]?.id;
			} else {
				nextActiveId = headings[0]?.id;
			}
		}

		if (nextActiveId !== activeHeadingId) {
			activeHeadingId = nextActiveId;
		}
	}
</script>

<svelte:window onscroll={setActiveHeading} />

<div>
	<ul class="menu w-56 rounded-box">
		<li class="menu-title">Content</li>
		{#each headings as heading (heading.id)}
			<li>
				<a class:active={activeHeadingId === heading.id} href={`#${heading.id}`}>{heading.value}</a>
			</li>
		{/each}
	</ul>
</div>
