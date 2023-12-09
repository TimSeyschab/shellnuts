import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter({ runtime: 'nodejs18.x' }),
		inlineStyleThreshold: 5000
	},
	preprocess:[ vitePreprocess(), mdsvex(mdsvexConfig)]
};

export default config;
