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
	<div class="py-2">
		<h3 class="h6">{position.company}</h3>
		<span class="text-surface-500">
			{position.start} - {position.end} - {position.tenure}
		</span>
		{#each position.roles as role (role)}
			{@render RoleBlock(role)}
		{/each}
	</div>
{/snippet}

{#snippet RoleBlock(role)}
	<div class="my-2">
		<h6 class="font-bold">{role.title}</h6>
		<small class="text-surface-500">{role.start} - {role.end}</small>
		{#if role.description}
			<p>{role.description}</p>
		{/if}
		{#if role.list}
			<ul class="list-inside list-disc">
				{#each role.list as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/snippet}
