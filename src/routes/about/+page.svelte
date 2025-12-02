<script lang="ts">
	import { MainLayout } from '$lib/layout';
	import { getResume } from './data.remote';
</script>

<MainLayout>
	{#await getResume() then positions}
		{#each positions as position, index (position)}
			{@render PositionBlock(position)}
			{#if index < positions.length - 1}
				<hr class="hr border-surface-100-900" />
			{/if}
		{/each}
	{/await}
</MainLayout>

{#snippet PositionBlock(position)}
	<h6 class="h6">{position.company}</h6>
	<span class="text-surface-500">
		{position.start} - {position.end} - {position.tenure}
	</span>
	{#each position.roles as role (role)}
		{@render RoleBlock(role)}
	{/each}
{/snippet}

{#snippet RoleBlock(role)}
	<h6 class="h6">{role.title}</h6>
{/snippet}
