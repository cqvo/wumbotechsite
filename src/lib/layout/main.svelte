<script lang="ts">
	import { NavMobileBar, NavRail, NavSidebar } from '$lib/ui';
	let { children } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-[auto_1fr]">
	<aside class="hidden sm:max-xl:block">
		<NavRail />
	</aside>

	<aside class="hidden xl:block">
		<NavSidebar />
	</aside>
	<main class="p-4 sm:px-8 md:px-16 lg:px-32 2xl:px-64">
		{@render children()}
	</main>

	<footer class="sticky bottom-0 block sm:hidden">
		<NavMobileBar />
	</footer>
</div>
