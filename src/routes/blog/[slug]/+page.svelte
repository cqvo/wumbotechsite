<script lang="ts">
	import { MainLayout } from '$lib/layout';
	import { getPost } from '$lib/sanity';

	let { params } = $props();

	const post = $derived(getPost(params.slug));
</script>

<MainLayout>
	{post.current}
</MainLayout>
