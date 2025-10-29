<script lang="ts">
	import type { HeroContent } from '$lib/content/hero';
	import { heroContent } from '$lib/content/hero';
	import { cn } from '$lib/utils/classnames';

	interface Props {
		content?: HeroContent;
		class?: string;
	}

	let { content = heroContent, class: className = '' }: Props = $props();
</script>

<section
	class={cn('relative flex min-h-screen items-center justify-center overflow-hidden', className)}
>
	<!-- Background with subtle grid pattern -->
	<div 
		class="absolute inset-0"
		style="background-color: var(--color-bg-primary);"
	>
		<div class="absolute inset-0"></div>
		<!-- Subtle grid pattern overlay -->
		<div class="absolute inset-0 opacity-10">
			<div class="grid-pattern"></div>
		</div>
	</div>

	<!-- Content Container -->
	<div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
		<!-- Badge -->
		<div 
			class="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm"
			style="background-color: var(--color-primary-bg); border: 1px solid var(--color-primary-dark);"
		>
			<span 
				class="h-2 w-2 animate-pulse rounded-full"
				style="background-color: var(--color-primary);"
			></span>
			<span 
				class="text-sm"
				style="color: var(--color-primary-dark);"
			>{content.badge.text}</span>
		</div>

		<!-- Headline -->
		<h1 class="mb-6 text-5xl leading-tight font-bold md:text-7xl lg:text-8xl">
			<span class="text-white">{content.headline.primary}</span>
			<br />
			<span style="color: var(--color-primary);">{content.headline.secondary}</span>
		</h1>

		<!-- Description -->
		<p class="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
			{content.description}
		</p>

		<!-- CTA Buttons -->
		<div class="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<!-- Primary CTA -->
			<a
				href={content.cta.primary.href}
				class="group inline-flex transform items-center gap-3 rounded-lg px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg primary-cta-button"
			>
				{content.cta.primary.text}
				<span class="text-xl transition-transform duration-300 group-hover:translate-x-1">
					{content.cta.primary.icon}
				</span>
			</a>

			<!-- Secondary CTA -->
			<a
				href={content.cta.secondary.href}
				class="inline-flex items-center rounded-lg border-2 px-8 py-4 font-semibold transition-all duration-300 hover:bg-gray-800/50 secondary-cta-button"
			>
				{content.cta.secondary.text}
			</a>

			<!-- Tertiary CTA -->
			<a
				href={content.cta.tertiary.href}
				class="inline-flex items-center rounded-lg px-8 py-4 font-semibold transition-colors duration-300 tertiary-cta-button"
			>
				{content.cta.tertiary.text}
			</a>
		</div>
	</div>
</section>

<style>
	/* Grid pattern */
	.grid-pattern {
		background-image:
			linear-gradient(rgba(44, 185, 129, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(44, 185, 129, 0.1) 1px, transparent 1px);
		background-size: 50px 50px;
	}

	/* CTA Button Styles */
	.primary-cta-button {
		background-color: var(--color-primary) !important;
		box-shadow: 0 0 0 0 var(--color-primary) !important;
	}

	.primary-cta-button:hover {
		background-color: var(--color-primary-dark) !important;
		box-shadow: 0 10px 25px -5px rgba(44, 185, 129, 0.25) !important;
	}

	.secondary-cta-button {
		border-color: var(--color-primary-dark) !important;
		color: var(--color-primary-dark) !important;
	}

	.secondary-cta-button:hover {
		border-color: var(--color-primary) !important;
		color: var(--color-primary) !important;
	}

	.tertiary-cta-button {
		color: var(--color-primary-dark) !important;
	}

	.tertiary-cta-button:hover {
		color: var(--color-primary) !important;
	}
</style>
