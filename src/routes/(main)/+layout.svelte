<script lang="ts">
	import { Sidebar } from '$lib/ui';

	let { children } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
	<aside class="hidden md:block">
		<Sidebar />
	</aside>
	<main>
		{@render children()}
	</main>
</div>
