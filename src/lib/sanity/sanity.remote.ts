import { query } from '$app/server';
import { sanityClient } from '$lib/sanity';
import * as v from 'valibot';
import type { SanityDocument } from '@sanity/client';

export const getPosts = query(v.string(), async (oldestPost: string): Promise<SanityDocument[]> => {
	const pageSize = 10;
	const posts = await sanityClient.fetch(
		`*[_type == "post" && publishedAt <= "${oldestPost}"] | order(publishedAt)[0...${pageSize}]{"postCount": count(post), ...}`
	);
	return posts;
});

const postSlugSchema = v.string();

export const getPost = query(postSlugSchema, async (slug: string): Promise<SanityDocument[]> => {
	const posts = await sanityClient.fetch(`*[_type == "post" && slug.current == "${slug}"]`);
	return posts[0];
});
