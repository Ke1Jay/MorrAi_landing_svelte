<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Morr.ai - AI-Powered Sales Intelligence</title>
	<meta name="description" content="Transform your sales process with AI-driven insights, automation, and intelligent decision support." />
</svelte:head>

<div 
	class="min-h-screen text-white dark"
	style="background-color: var(--color-bg-primary);"
>
	{@render children?.()}
</div>
