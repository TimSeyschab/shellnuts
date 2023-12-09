import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ runtime: 'nodejs18.x' }),
		inlineStyleThreshold: 5000
	},
	preprocess: vitePreprocess()
};

export default config;
