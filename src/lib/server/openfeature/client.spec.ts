import { describe, it, expect } from 'vitest';
import { initOpenFeature, getFeatureClient } from './index';

describe('openfeature', () => {
	it('init is fail-safe and evaluation falls back to the default without flag definitions', async () => {
		// No FLAGS env / bundled definitions in the test env, so the provider can't
		// load — initOpenFeature must not throw, and evaluation returns the default.
		await expect(initOpenFeature()).resolves.toBeUndefined();
		const client = getFeatureClient();
		const value = await client.getBooleanValue('marketing-banner', false);
		expect(value).toBe(false);
	});
});
