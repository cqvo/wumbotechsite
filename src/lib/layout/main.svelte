<script lang="ts">
	import { NavMobileBar, NavRail, NavSidebar } from '$lib/ui';
	let { children } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-[auto_1fr]">
	<aside class="hidden sm:max-xl:block">
		<NavRail />
	</aside>

	<aside class="hidden w-1/3 xl:block">
		<NavSidebar />
	</aside>

	<main class="mx-auto p-4 md:w-2/3">
		{@render children()}
	</main>

	<footer class="sticky bottom-0 block sm:hidden">
		<NavMobileBar />
	</footer>
</div>
