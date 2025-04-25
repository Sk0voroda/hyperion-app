<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	import Header from '$lib/components/Header/Header.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Header />

<div class="container mx-auto px-4 py-4">
	{@render children()}
</div>
