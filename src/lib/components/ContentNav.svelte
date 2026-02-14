<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	/**
	 * @typedef {{ id: string, value: string }} Heading
	 * @typedef {Object} Props
	 * @property {{ headings?: Heading[] }} post
	 */

	/** @type {Props} */
	let { post } = $props();

	/** @type {(HTMLElement | null)[]} */ let elements = [];
	let headings = $derived(post.headings ?? []);
	/** @type {Heading | undefined} */ let activeHeading = $state();
	/** @type {number} */ let scrollY = $state(0);

	$effect(() => {
		updateHeadings();
		if (!activeHeading && headings.length > 0) {
			activeHeading = headings[0];
		}
	});

	onMount(() => {
		setActiveHeading();
	});

	function updateHeadings() {
		if (browser) {
			elements = headings.map((heading) => document.getElementById(heading.id));
		}
	}

	function setActiveHeading() {
		if (!browser || headings.length === 0) {
			return;
		}

		scrollY = window.scrollY;

		const visibleIndex =
			elements.findIndex(
				(element) => element && element.offsetTop + element.clientHeight > scrollY
			) - 1;
		activeHeading = headings[visibleIndex];

		const pageHeight = document.body.scrollHeight || 1;
		const scrollProgress = (scrollY + window.innerHeight) / pageHeight;

		if (!activeHeading) {
			if (scrollProgress > 0.5) {
				activeHeading = headings[headings.length - 1];
			} else {
				activeHeading = headings[0];
			}
		}
	}
</script>

<svelte:window onscroll={setActiveHeading} />

<div>
	<ul class="menu w-56 rounded-box">
		<h2 class="menu-title">Content</h2>
		{#each headings as heading (heading.id)}
			<li>
				<a class:active={activeHeading === heading} href={`#${heading.id}`}>{heading.value}</a>
			</li>
		{/each}
	</ul>
</div>
