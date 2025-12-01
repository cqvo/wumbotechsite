<script lang="ts">
	import Wumbology from '$lib/ui/wumbology.svelte';
	import BlogFeed from '$lib/ui/blogfeed.svelte';
	import { MainLayout } from '$lib/layout';

	let { data } = $props();
</script>

<MainLayout>
	<Wumbology />

	<BlogFeed posts={data.posts} />
</MainLayout>
