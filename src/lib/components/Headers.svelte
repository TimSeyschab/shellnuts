<script>
	import GithubMark from '$lib/icons/GithubMark.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { themes } from '$lib/themes.js';

	let /** @type {number} */ previousY,
		/** @type {number} */ currentY = $state(),
		/** @type {number} */ clientHeight = $state();

	/**
	 * @param {any} y
	 */
	const deriveDirection = (y) => {
		const direction = !previousY || previousY < y ? 'down' : 'up';
		previousY = y;

		return direction;
	};

	let scrollDirection = $derived(deriveDirection(currentY));
	let offscreen = $derived(scrollDirection === 'down' && currentY > clientHeight * 4);

	let darkMode = false;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				darkMode = theme === 'forest';
			}
		}
	});

	function handleSwitchDarkMode() {
		darkMode = !darkMode;
		const one_year = 60 * 60 * 24 * 365;
		let theme = 'garden';
		if (darkMode) {
			theme = 'forest';
		}
		window.localStorage.setItem('theme', theme);
		document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Strict;`;
		document.documentElement.setAttribute('data-theme', theme);
	}

	if (browser) {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			handleSwitchDarkMode();
		}
	}
</script>

<svelte:window bind:scrollY={currentY} />

<header
	class="sticky top-0 flex h-[var(--header-height)] items-center bg-surface-1/50 px-4 mb-2 text-lg backdrop-blur-sm transition-transform ease-in bg-secondary-content"
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
		<label class="swap swap-rotate" aria-label="toggle darkmode" aria-live="polite">
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" onclick={handleSwitchDarkMode} />
			<!-- sun icon -->
			<svg
				class="swap-on fill-current w-8 h-8"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
				/></svg
			>
			<!-- moon icon -->
			<svg
				class="swap-off fill-current w-8 h-8"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
				/></svg
			>
		</label>
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
