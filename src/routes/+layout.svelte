<script>
	import '../app.css';
	import '../prism.css'
	import '@fontsource-variable/source-code-pro';
	import Headers from '$lib/components/Headers.svelte';
</script>

<Headers />
<slot />

<style>
    :global(body) {
        font-family: 'Source Code Pro Variable', sans-serif;
    }
</style>