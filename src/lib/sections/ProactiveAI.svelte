<script lang="ts">
  import type { ProactiveAIContent } from '$lib/content/proactive-ai';
  import { proactiveAIContent } from '$lib/content/proactive-ai';
  import { cn } from '$lib/utils/classnames';
  import EliminatePrepBlock from './blocks/EliminatePrepBlock.svelte';
  import SmarterDecisionsBlock from './blocks/SmarterDecisionsBlock.svelte';
  import KnowEverythingBlock from './blocks/KnowEverythingBlock.svelte';
  import FocusMattersBlock from './blocks/FocusMattersBlock.svelte';
  import { onMount } from 'svelte';

  interface Props {
    content?: ProactiveAIContent;
    class?: string;
  }

  let { content = proactiveAIContent, class: className = '' }: Props = $props();

  let sectionVisible = $state(false);

  onMount(() => {
    // Trigger section animation
    setTimeout(() => {
      sectionVisible = true;
    }, 100);
  });
</script>

<section 
  class={cn(
    'relative py-24 px-6',
    sectionVisible ? 'opacity-100' : 'opacity-0',
    className
  )}
  style="background-color: var(--color-bg-primary);"
>
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-5">
    <div class="grid-pattern"></div>
  </div>

  <!-- Content Container -->
  <div class="relative z-10 mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-16 text-center">
      <!-- Badge -->
      <div 
        class="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm"
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
      <h2 class="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
        <span class="text-white">{content.headline.primary}</span>
        <br />
        <span style="color: var(--color-primary);">{content.headline.secondary}</span>
      </h2>

      <!-- Description -->
      <p class="mx-auto max-w-4xl text-xl leading-relaxed text-gray-300 md:text-2xl">
        {content.description}
      </p>
    </div>

    <!-- Blocks Grid -->
    <div class="grid gap-8 md:grid-cols-2">
      <!-- Top Row -->
      <div class="flex flex-col space-y-8">
        <EliminatePrepBlock class="flex-1" />
        <KnowEverythingBlock class="flex-1" />
      </div>

      <!-- Bottom Row -->
      <div class="flex flex-col space-y-8">
        <SmarterDecisionsBlock class="flex-1" />
        <FocusMattersBlock class="flex-1" />
      </div>
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

  /* Staggered animation for blocks */
  .block-animation {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Hover effects for the entire section */
  :global(.proactive-ai-block) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    background-color: #0c0e0e !important;
  }

  :global(.proactive-ai-block:hover) {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(37, 148, 104, 0.1);
  }

  :global(.proactive-ai-block:hover::before) {
    opacity: 1;
  }

  :global(.proactive-ai-block::before) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(37, 148, 104, 0.1) 0%, transparent 50%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  /* Animation container background */
  :global(.proactive-ai-block .animation-container) {
    background-color: #070c0b !important;
  }

  /* Icon box background */
  :global(.proactive-ai-block .icon-box) {
    background-color: #0d1715 !important;
  }

  /* Text and icon color */
  :global(.proactive-ai-block .primary-text) {
    color: #259468 !important;
  }

  :global(.proactive-ai-block .primary-icon) {
    color: #259468 !important;
  }

  /* Pulse animation for AI indicators */
  :global(.ai-indicator) {
    animation: ai-pulse 2s infinite;
  }

  @keyframes ai-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  /* Glow effect for primary elements */
  :global(.primary-glow) {
    box-shadow: 0 0 20px rgba(44, 185, 129, 0.3);
  }

  /* Smooth transitions for all interactive elements */
  :global(.proactive-ai-block *) {
    transition: all 0.2s ease;
  }
</style>
