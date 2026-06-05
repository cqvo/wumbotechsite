import { OpenFeature, InMemoryProvider } from '@openfeature/server-sdk';

// Example flag config from the install guide — placeholder, not a real flag.
const flagConfig = {
	'new-message': {
		disabled: false,
		variants: { on: true, off: false },
		defaultVariant: 'on'
	}
};

const provider = new InMemoryProvider(flagConfig);

/** Register the provider and await readiness. Call once at server startup. */
export async function initOpenFeature() {
	await OpenFeature.setProviderAndWait(provider);
}

/** Get a client for evaluating flags from server code. */
export function getFeatureClient() {
	return OpenFeature.getClient();
}
