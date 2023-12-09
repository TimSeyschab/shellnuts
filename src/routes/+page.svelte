<script>
    const wait = () => new Promise((res) => setTimeout(res, 3000))
    let stageOne = false;
    let stageTwo = false;
    let stageThree = false;

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
                                       on:introend={() => (stageOne = true)}>npm i shellnuts</code></pre>
            {#if stageOne === true}
                <pre data-prefix="λ"><code class="text-error" transition:typewriter
                                           on:introend={() => (stageTwo = true)}>npm ERR! code E404</code></pre>
            {/if}
            {#if stageTwo === true}
                <pre data-prefix="λ"><code class="text-error"  transition:typewriter
                                           on:introend={() => (stageThree = true)}>npm ERR! 404  'shellnuts' is not in this registry.</code></pre>
            {/if}
            {#if stageThree === true}
                <pre data-prefix="λ"><code class="text-success" transition:typewriter>🤖 shellnuts will be available soon.</code></pre>
            {/if}
        </div>
    {/await}
</div>



