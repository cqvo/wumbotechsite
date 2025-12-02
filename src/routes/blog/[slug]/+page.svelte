<script lang="ts">
	import { MainLayout } from '$lib/layout';
	import BlogPost from '$lib/ui/blogpost.svelte';

	let { params } = $props();
</script>

<MainLayout>
	<BlogPost slug={params.slug} />
</MainLayout>
