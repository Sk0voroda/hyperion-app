<script lang="ts">
	import '../../app.css';

	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let logged = $derived(Boolean(data.user));

	const handleLogout = async () => {
		try {
			await fetch('/api/logout', { method: 'POST' });

			await invalidateAll();
		} catch (error) {
			console.error(error);
		}
	};
</script>

<header class="bg-blue-200">
	<nav class="container mx-auto px-6 py-4">
		<div class="flex justify-between">
			<div class="flex space-x-2">
				<a href="/" class="px-4 py-2">Home</a>
				<a href="/accounts" class="px-4 py-2">My accounts</a>
			</div>
			<div class="flex space-x-2">
				<a href="/accounts/add" class="rounded-md bg-blue-400 px-4 py-2 hover:opacity-90"
					>+ Add account</a
				>
				{#if logged}
					<button class="cursor-pointer rounded-md border px-4 py-2" onclick={handleLogout}
						>Logout</button
					>
				{:else}
					<a href="/auth/login" class="rounded-md border px-4 py-2">Login</a>
				{/if}
			</div>
		</div>
	</nav>
</header>

<div class="container mx-auto px-4 py-4">
	{@render children()}
</div>
