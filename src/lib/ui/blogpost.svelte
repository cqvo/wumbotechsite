<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import type { SanityDocument } from '@sanity/client';
	import { getPost } from '$lib/sanity';

	interface BlogPostProps {
		slug: string;
	}

	let { slug }: BlogPostProps = $props();

	const post: SanityDocument = $derived(await getPost(slug));
</script>

<div class="block space-y-4 overflow-hidden card">
	<header>
		<h3 class="h3">{post.title}</h3>
		{new Date(post.publishedAt).toDateString()}
	</header>
	<article class="space-y-4">
		<PortableText value={post.body} />
	</article>
</div>
