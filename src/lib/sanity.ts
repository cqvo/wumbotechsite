import { createClient, type ClientConfig, type SanityClient } from '@sanity/client';

const config: ClientConfig = {
	projectId: 'ohjvh7jh',
	dataset: 'production',
	apiVersion: '2024-01-01',
	useCdn: true
};

export const sanityClient = createClient(config) satisfies SanityClient;

export default sanityClient;
