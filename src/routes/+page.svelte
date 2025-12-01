<script lang="ts">
	import BlogFeed from '$lib/ui/blogfeed.svelte';
	import { MainLayout } from '$lib/layout';

	let { data } = $props();
</script>

<MainLayout>
	<BlogFeed posts={data.posts} />
</MainLayout>
