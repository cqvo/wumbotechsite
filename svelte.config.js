import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	// Pin the serverless runtime so builds are deterministic regardless of the
	// builder's local Node version (matches the Vercel project's Node 22.x).
	kit: { adapter: adapter({ runtime: 'nodejs22.x' }) }
};

export default config;
