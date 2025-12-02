<script lang="ts">
	import BlogFeed from '$lib/ui/blogfeed.svelte';
	import { MainLayout } from '$lib/layout';
	import { getPosts } from '$lib/sanity';

	const posts = getPosts();
</script>

<MainLayout>
	<BlogFeed posts={posts.current} />
</MainLayout>
