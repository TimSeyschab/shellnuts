<script>
    import GithubMark from "$lib/icons/GithubMark.svelte";
    import ThemeToggleIcon from "$lib/icons/ThemeToggleIcon.svelte";
    import {browser} from "$app/environment";
    import {onMount} from "svelte";
    import {themes} from "$lib/themes.js";

    let
    /** @type {number} */ previousY,
    /** @type {number} */ currentY,
    /** @type {number} */ clientHeight

    /**
     * @param {any} y
     */
    const deriveDirection = (y) => {
        const direction = !previousY || previousY < y ? 'down' : 'up'
        previousY = y

        return direction
    }

    $: scrollDirection = deriveDirection(currentY)
    $: offscreen = scrollDirection === 'down' && currentY > clientHeight * 4

    let darkMode = false;

    onMount(() => {
        if (typeof window !== 'undefined') {
            const theme = window.localStorage.getItem('theme')
            if (theme && themes.includes(theme)) {
                document.documentElement.setAttribute('data-theme', theme)
                darkMode = theme === "forest"
            }
        }
    })

    function handleSwitchDarkMode() {
        darkMode = !darkMode;
        const one_year = 60 * 60 * 24 * 365
        let theme = 'garden'
        if(darkMode) {
            theme = 'forest'
        }
        window.localStorage.setItem('theme', theme)
        document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Strict;`
        document.documentElement.setAttribute('data-theme', theme)
    }

    if (browser) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            //handleSwitchDarkMode();
        }
    }
</script>

<svelte:window bind:scrollY={currentY} />

<header
        class="sticky top-0 flex h-[var(--header-height)] items-center bg-surface-1/50 px-2 mb-2 text-lg backdrop-blur-sm transition-transform ease-in md:px-0 bg-secondary-content"
        class:motion-safe:-translate-y-full={offscreen}
        bind:clientHeight
>
    <nav class="flex flex-grow">
        <a href="/" class="mr-4 text-2xl font-mono md:mr-8">Shellnuts</a>
        <ul class="mr-4 flex flex-grow items-center gap-4 md:gap-8">
            <li>
                <a href="/blog">Blog</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
        </ul>
    </nav>
    <div class="flex items-center content-end gap-4 md:gap-8">
        <button
                on:click={handleSwitchDarkMode}
                class="transition-colors hover:text-prime"
                aria-label="toggle darkmode"
                aria-live="polite"
        >
            <ThemeToggleIcon className={darkMode ? 'dark w-6' : 'w-6'} />
        </button>
        <a
                href="https://github.com/TimSeyschab/shellnuts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                class="transition-colors hover:text-prime"
        >
            <GithubMark className="w-6" />
        </a>
    </div>
</header>
