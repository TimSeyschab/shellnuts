<script>
    const wait = () => new Promise((res) => setTimeout(res, 1000))
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
        const duration = text.length / (0.01);

        return {
            duration,
            tick: (t) => {
                const i = ~~(text.length * t);
                node.textContent = text.slice(0, i);
            }
        };
    }
</script>

<div class="h-screen flex items-center justify-center">
	{#await wait()}
		<span class="loading loading-spinner text-secondary w-20">Loading</span>
	{:then _}
		<div class="mockup-code">
            <pre data-prefix="λ"><code transition:typewriter
																			 onintroend={() => (stageOne = true)}>npm install -g shellnuts</code></pre>
			{#if stageOne === true}
				<pre data-prefix="λ"><code class="text-success">up to date, audited 1 package in 1s</code></pre>
				<pre data-prefix="λ"><code class="text-success">Check out the <a class="link-secondary underline" href="./blog">blog</a> 🤖</code></pre>
			{/if}
		</div>
	{/await}
</div>

<style>
	.mockup-code {
			width: 24rem;
			height: 9rem
	}
</style>

