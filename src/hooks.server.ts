import { env } from '$env/dynamic/public';
import type { Handle, ServerInit } from '@sveltejs/kit';
import { initOpenFeature } from '$lib/server/openfeature';

export const init: ServerInit = async () => {
	await initOpenFeature();
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Keep every non-production environment (staging, previews) out of search indexes.
	if (env.PUBLIC_VERCEL_TARGET_ENV !== 'production') {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
};
