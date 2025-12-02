import { query } from '$app/server';
import { sanityClient } from '$lib/sanity';
import * as v from 'valibot';

export const getPosts = query(async () => {
	const posts = await sanityClient.fetch('*[_type == "post"] | order(publishedAt)[0...7]');
	return posts;
});

export const getPost = query(v.string(), async (slug: string) => {
	const post = await sanityClient.fetch(`*[_type == "post" && slug.current == "${slug}"]`);
	return post;
});
