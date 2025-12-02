<script lang="ts">
	import { CircleUserRoundIcon, HouseIcon, NewspaperIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const linksRail = [
		{ label: 'Home', href: '/', icon: HouseIcon },
		{ label: 'About', href: '/about', icon: CircleUserRoundIcon },
		{ label: 'Blog', href: '/blog', icon: NewspaperIcon }
	];
	let anchorRail =
		'btn hover:preset-tonal aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5';
</script>

<div class="grid h-screen w-full grid-cols-[auto_1fr] border border-surface-200-800">
	<Navigation layout="rail">
		<Navigation.Content>
			<Navigation.Menu>
				{#each linksRail as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={anchorRail}>
						<Icon class="size-5" />
						<span class="text-xs">{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
</div>
