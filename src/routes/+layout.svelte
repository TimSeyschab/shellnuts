<script>
	import '../app.css';
	import '../prism.css'
	import '@fontsource-variable/source-code-pro';
	import Headers from '$lib/components/Headers.svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<Headers />
<slot />

<style>
    :global(body) {
        font-family: 'Source Code Pro Variable', sans-serif;
    }
</style>