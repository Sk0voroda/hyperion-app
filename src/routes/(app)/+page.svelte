<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.user}
	<h1>Hello {data.user.email}</h1>
{:else}
	<h1>Hello user</h1>
{/if}
