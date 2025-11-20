<script lang="ts">
	import { resolve } from '$app/paths';
	import type { SanityDocument } from '@sanity/client';

	interface Props {
		posts: SanityDocument[];
	}

	let { posts }: Props = $props();
</script>

{#snippet blogPost(post: SanityDocument)}
	{@const postUrl = resolve('/(main)/blog/[slug]', { slug: post.slug.current })}
	<div class="block space-y-4 overflow-hidden card p-4">
		<header>
			<h3 class="h3">{post.title}</h3>
			{new Date(post.publishedAt).toDateString()}
		</header>
		<article class="space-y-4">
			{post.excerpt}
		</article>
		<footer>
			<a href={postUrl} class="anchor">Continue reading</a>
		</footer>
	</div>
{/snippet}

{#each posts as post (post)}
	{@render blogPost(post)}
{/each}
