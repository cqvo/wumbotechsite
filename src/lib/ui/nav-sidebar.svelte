<script lang="ts">
	import { CircleUserRoundIcon, GithubIcon, NewspaperIcon } from '@lucide/svelte';
	import type { Icon } from '@lucide/svelte';
	import { Avatar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import ProfilePic from '$lib/assets/trooper.jpg';

	interface NavItem {
		label: string;
		href: string;
		icon: typeof Icon;
	}

	const linksSidebar: NavItem[] = [
		{ label: 'About', href: '/about', icon: CircleUserRoundIcon },
		{ label: 'Blog', href: '/blog', icon: NewspaperIcon },
		{ label: 'Github', href: 'https://www.github.com/cqvo', icon: GithubIcon }
	];

	let anchorSidebar = 'btn hover:preset-tonal justify-start px-2 w-full';
</script>

<div class="grid h-screen w-full grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<Navigation layout="sidebar" class="grid grid-rows-[auto_1fr_auto] gap-4">
		<Navigation.Header class="grid grid-cols-1 space-y-4 p-4">
			{@render Me()}
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Menu class="mx-auto w-fit">
				{#each linksSidebar as link (link)}
					{@render NavItem(link)}
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
</div>

{#snippet Me()}
	<Avatar class="mx-auto size-36">
		<Avatar.Image src={ProfilePic} />
		<Avatar.Fallback>CV</Avatar.Fallback>
	</Avatar>
	<div class="mx-auto justify-items-center">
		<h3 class="h3 font-mono">Chris Vo</h3>
		<h6 class="text-surface-500 italic">Chief Wumbologist</h6>
		<span class="font-bold">chris (at) wumbo.tech</span>
	</div>
{/snippet}

{#snippet NavItem(link: NavItem)}
	{@const Icon = link.icon}
	<a href={link.href} class={anchorSidebar} title={link.label} aria-label={link.label}>
		<Icon class="size-4" />
		<span>{link.label}</span>
	</a>
{/snippet}
