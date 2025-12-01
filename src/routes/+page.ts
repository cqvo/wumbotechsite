import type { PageLoad } from './$types';
import sanityClient from '$lib/sanity';

export const load: PageLoad = async () => {
	const posts = await sanityClient.fetch('*[_type == "post"] | order(publishedAt)[0...7]');
	return { posts };
};
