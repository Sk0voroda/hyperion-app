<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	{#if data.accounts.length === 0}
		<p>no accounts here</p>
	{:else}
		<ul class="space-y-2">
			{#each data.accounts as account (account.id)}
				<li class="flex justify-between">
					<span>
						{account.name} - {account.phoneNumber}
					</span>
					<div class="flex space-x-2">
						<span class="rounded-md border border-blue-300 p-2"
							>{account.sessionToken ? 'logged in' : 'logged out'}</span
						>
						<div class="flex space-x-2">
							<a href={`/accounts/${account.id.toString()}`} class="p-2">Details</a>
							<form use:enhance method="POST" action={`?/delete_account&id=${account.id}`}>
								<button class="cursor-pointer rounded-md border border-red-400 p-2">Delete</button>
							</form>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
