<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { GoogleTagManager, SpeedInsights, Amplitude } from '$lib/analytics';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<GoogleTagManager />
<SpeedInsights />
<Amplitude />
{@render children()}
