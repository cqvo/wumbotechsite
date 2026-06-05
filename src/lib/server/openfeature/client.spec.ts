import { describe, it, expect } from 'vitest';
import { initOpenFeature, getFeatureClient } from './index';

describe('openfeature', () => {
	it('evaluates the example new-message flag to true after init', async () => {
		await initOpenFeature();
		const client = getFeatureClient();
		const value = await client.getBooleanValue('new-message', false);
		expect(value).toBe(true);
	});
});
