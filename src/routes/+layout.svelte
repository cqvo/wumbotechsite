<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { AnalyticsProvider } from '$lib/analytics';
	import { SilktideConsentManager } from '$lib/silktide';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AnalyticsProvider />
<SilktideConsentManager />

{@render children()}
