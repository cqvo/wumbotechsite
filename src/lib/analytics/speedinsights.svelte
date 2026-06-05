<script lang="ts">
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { env } from '$env/dynamic/public';

	if (env.PUBLIC_VERCEL_TARGET_ENV === 'production') injectSpeedInsights();
</script>
