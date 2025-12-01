<script lang="ts">
	import { HouseIcon, CircleUserRoundIcon, NewspaperIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '/', icon: HouseIcon },
		{ label: 'Blog', href: '/blog', icon: NewspaperIcon },
		{ label: 'About', href: '/about', icon: CircleUserRoundIcon },
		{ label: 'About', href: '/about', icon: CircleUserRoundIcon }
	];

	let anchorBar = 'btn hover:preset-tonal flex-col items-center gap-1';
</script>

<Navigation layout="bar">
	<Navigation.Menu class="grid grid-cols-4 gap-2">
		{#each links as link (link)}
			{@const Icon = link.icon}
			<a href={link.href} class={anchorBar}>
				<Icon class="size-5" />
				<span class="text-[10px]">{link.label}</span>
			</a>
		{/each}
	</Navigation.Menu>
</Navigation>
