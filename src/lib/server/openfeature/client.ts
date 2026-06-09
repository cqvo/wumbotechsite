import { OpenFeature } from '@openfeature/server-sdk';
import { flagsClient } from '@vercel/flags-core';
import { VercelProvider } from '@vercel/flags-core/openfeature';

const provider = new VercelProvider(flagsClient);

/**
 * Register the Vercel Flags provider and await readiness. Call once at server startup.
 *
 * Resilient by design: if flag definitions can't be loaded — e.g. no `FLAGS` env
 * var locally, or the Flags service is briefly unreachable with no build-time
 * bundle to fall back on — we log and continue rather than crash the server.
 * Evaluations then fall back to the defaults passed at each call site.
 */
export async function initOpenFeature() {
	try {
		await OpenFeature.setProviderAndWait(provider);
	} catch (error) {
		console.error('[openfeature] Failed to initialize Vercel Flags provider:', error);
	}
}

/** Get a client for evaluating flags from server code. */
export function getFeatureClient() {
	return OpenFeature.getClient();
}
