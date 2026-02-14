<script>
	import { browser } from '$app/environment'
	import { onMount } from 'svelte'

	/**
	 * @typedef {Object} Props
	 * @property {any} post
	 */

	/** @type {Props} */
	let { post } = $props();

	/** @type {HTMLElement[]} */ let elements = []
	let headings = $state(post.headings)

	onMount(() => {
		updateHeadings()
		setActiveHeading()
	})

	let activeHeading = $state(headings[0])
	/** @type {number} */ let scrollY

	function updateHeadings() {
		headings = post.headings

		if (browser) {
			elements = headings.map((heading) => {
				return document.getElementById(heading.id)
			})
		}
	}
	function setActiveHeading() {
		scrollY = window.scrollY

		const visibleIndex =
			elements.findIndex((element) => element.offsetTop + element.clientHeight > scrollY) - 1
		activeHeading = headings[visibleIndex]

		const pageHeight = document.body.scrollHeight
		const scrollProgress = (scrollY + window.innerHeight) / pageHeight

		if (!activeHeading) {
			if (scrollProgress > 0.5) {
				activeHeading = headings[headings.length - 1]
			} else {
				activeHeading = headings[0]
			}
		}
	}
</script>

<svelte:window onscroll={setActiveHeading} />

<div>
		<ul class="menu w-56 rounded-box">
			<h2 class="menu-title">Content</h2>
			{#each headings as heading}
				<li>
					<a class:active={activeHeading === heading} href={`#${heading.id}`}>{heading.value}</a>
				</li>
			{/each}
		</ul>
</div>