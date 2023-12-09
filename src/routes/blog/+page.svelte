<script>
    import {onMount} from "svelte";

    let isPulsating = true;

    onMount(() => {
        // Start the pulsating effect when the component is mounted
        const interval = setInterval(() => {
            isPulsating = !isPulsating;
        }, 3000); // Change the interval duration as needed

        return () => {
            // Clean up the interval when the component is unmounted
            clearInterval(interval);
        };
    });
</script>

<style lang="postcss">
    .pulsating-text {
        @apply transform scale-0 transition-transform ease-in-out text-9xl duration-1000;
    }

    .pulsating-text.pulsate {
        @apply scale-150;
    }
</style>
<div class="h-screen flex items-center justify-center">
    <div class="{isPulsating ? 'pulsating-text pulsate' : 'pulsating-text'}">
        🤖
    </div>
</div>
