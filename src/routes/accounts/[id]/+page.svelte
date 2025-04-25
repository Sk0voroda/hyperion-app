<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div>
	{#if !data.account}
		<p>No accoutn exist</p>
	{:else}
		<div class="flex justify-between">
			<div>
				<p>Name: {data.account.name}</p>
				<p>Phone number: {data.account.phoneNumber}</p>
			</div>
			{#if data.account?.sessionToken}
				<p>logged</p>
			{:else}
				<p>logged out</p>
			{/if}
			<div class="flex gap-2">
				{#if !data.account.sessionToken}
					<form use:enhance method="POST" action="?/send_code">
						<button class="cursor-pointer rounded-md border border-blue-400 p-2">Login</button>
					</form>
				{/if}
				<form use:enhance method="POST" action="?/delete_account">
					<button class="cursor-pointer rounded-md border border-red-400 p-2">Delete</button>
				</form>
			</div>
		</div>
		{#if form?.success && (!form.authorized || !data.account.sessionToken)}
			<form method="POST" use:enhance action="?/login">
				<label for="code">Code:</label>
				<input type="text" name="code" />
				<label for="code">Password:</label>
				<input type="password" name="password" />
				<button type="submit" class="cursor-pointer rounded-md border border-blue-400 p-2"
					>Login</button
				>
			</form>
		{/if}
		{#if form?.error}
			<p class="text-red-500">Something went wrong! - {form.status}</p>
		{/if}
	{/if}
</div>
