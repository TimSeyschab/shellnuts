<script>
	import '../app.css';
	import '../prism.css'
	import '@fontsource-variable/source-code-pro';
	import Headers from '$lib/components/Headers.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<Headers />
{@render children?.()}

<style>
    :global(body) {
        font-family: 'Source Code Pro Variable', sans-serif;
    }
</style>