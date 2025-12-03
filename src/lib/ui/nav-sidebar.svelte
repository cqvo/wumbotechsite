<script lang="ts">
	import { CircleUserRoundIcon, HouseIcon, NewspaperIcon } from '@lucide/svelte';
	import { Avatar, Navigation } from '@skeletonlabs/skeleton-svelte';

	const linksSidebar = [
		{ label: 'Home', href: '/', icon: HouseIcon },
		{ label: 'About', href: '/about', icon: CircleUserRoundIcon },
		{ label: 'Blog', href: '/blog', icon: NewspaperIcon }
	];

	let anchorSidebar = 'btn hover:preset-tonal justify-start px-2 w-full';
</script>

<div class="grid h-screen w-full grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<Navigation layout="sidebar" class="grid grid-rows-[auto_1fr_auto] gap-4">
		<Navigation.Header class="grid grid-cols-1 space-y-4 p-4">
			{@render Me()}
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Menu>
				{#each linksSidebar as link (link)}
					{@const Icon = link.icon}
					<a href={link.href} class={anchorSidebar} title={link.label} aria-label={link.label}>
						<Icon class="size-4" />
						<span>{link.label}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
</div>

{#snippet Me()}
	<Avatar class="mx-auto size-36">
		<Avatar.Image src="https://avatars.githubusercontent.com/u/50410061?v=4" />
		<Avatar.Fallback>CV</Avatar.Fallback>
	</Avatar>
	<div class="mx-auto">
		<h3 class="h3 font-mono">Chris Vo</h3>
		<h6 class="text-surface-500 italic">Chief Wumbologist</h6>
	</div>
{/snippet}
