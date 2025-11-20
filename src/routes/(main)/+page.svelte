<script lang="ts">
	import Wumbology from '$lib/ui/wumbology.svelte';
	import BlogFeed from '$lib/ui/blogfeed.svelte';

	let { data } = $props();
</script>

<Wumbology />

<BlogFeed posts={data.posts} />
