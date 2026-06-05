<script lang="ts">
	import * as amplitude from '@amplitude/unified';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	const apiKey = env.PUBLIC_AMPLITUDE_API_KEY ?? 'bf6f5ee6de23eeb0b2fd7facbe621e33';

	if (browser && apiKey) {
		amplitude.initAll(apiKey, { analytics: { autocapture: true } });
	}
</script>
