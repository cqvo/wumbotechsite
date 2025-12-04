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

	<main class="mx-auto min-h-screen max-w-2xl space-y-4 p-4">
		{@render children()}
	</main>

	<footer class="sticky bottom-0 z-10 block max-h-fit sm:hidden">
		<NavMobileBar />
	</footer>
</div>
