<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="py-5">
	<form use:enhance method="POST" action="?/add_account" class="flex flex-col space-y-4">
		<label for="phoneNumber">Name:</label>
		<input type="text" name="name" />
		<label for="phoneNumber">Phone number:</label>
		<input type="text" name="phoneNumber" />
		<div class="flex justify-end">
			<button
				type="submit"
				class="rounded bg-blue-500 px-4 py-2 text-white hover:cursor-pointer hover:bg-blue-700"
				>add</button
			>
		</div>
	</form>
	{#if form?.success}
		<p class="p-2 text-green-600">Account added successfully</p>
	{/if}
	{#if form?.error}
		<p class="p-2 text-red-400">Error occured - {form.message}</p>
	{/if}
</div>
