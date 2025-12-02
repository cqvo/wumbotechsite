<script lang="ts">
	import { resolve } from '$app/paths';
	import { PortableText } from '@portabletext/svelte';
	import { ArrowRightIcon } from '@lucide/svelte';
	import type { SanityDocument } from '@sanity/client';
	import { getPosts } from '$lib/sanity';

	let queryDate = $state(new Date().toISOString());
	const posts: SanityDocument[] = $derived(await getPosts(queryDate));

	const handleOlderPostsClick = () => {
		try {
			queryDate = posts[10].publishedAt;
		} catch (err) {
			console.error(err);
		}
	};
</script>

{#snippet blogPost(post: SanityDocument)}
	{@const postUrl = resolve('/blog/[slug]', { slug: post.slug.current })}
	<div class="block space-y-4 overflow-hidden card">
		<header>
			<h3 class="h3">{post.title}</h3>
			{new Date(post.publishedAt).toDateString()}
		</header>
		<article class="space-y-4">
			<PortableText value={post.excerpt} />
		</article>
		<footer>
			<a href={postUrl} class="anchor">Continue reading</a>
		</footer>
	</div>
{/snippet}

<div class="space-y-4 p-4">
	{#each posts as post, index (post)}
		{#if index != 10}
			{@render blogPost(post)}
		{/if}
	{/each}
	{#if posts[10]}
		<button class="btn preset-tonal-primary" onclick={handleOlderPostsClick}
			>Older Posts <ArrowRightIcon /></button
		>
	{/if}
</div>
