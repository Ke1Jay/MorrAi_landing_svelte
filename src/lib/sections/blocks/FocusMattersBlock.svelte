<script lang="ts">
  import { onMount } from 'svelte';
  import BaseOutcomeCard from './BaseOutcomeCard.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  let isVisible = $state(false);
  let cursorVisible = $state(true);
  let workflowVisible = $state(false);

  onMount(() => {
    // Trigger animation on mount
    setTimeout(() => {
      isVisible = true;
    }, 400);

    // Workflow animation
    setTimeout(() => {
      workflowVisible = true;
    }, 700);

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 500);

    return () => clearInterval(cursorInterval);
  });

  const journeyPoints = [
    { timing: "Before calls", description: "Complete client context and competitive intelligence" },
    { timing: "During", description: "Real-time access to relevant information" },
    { timing: "After", description: "Automated follow-ups and next step tracking" }
  ];

  const roles = ["Sales Reps", "Account Execs", "Success"];
</script>

  <BaseOutcomeCard
    icon="🎯"
    title="Focus on What Matters"
    description="Let AI handle research and follow-ups while you focus on building client relationships."
    {journeyPoints}
    {roles}
    {isVisible}
    class={className}
  >

    <div slot="animation" class="w-full h-full p-4 rounded-lg">
    <div class="mb-4 flex items-center gap-2">
      <div class="h-2 w-2 rounded-full" style="background-color: #259468;"></div>
      <span class="text-sm font-medium primary-text">Sales Workflow Automation</span>
      <span class="ml-auto rounded-full px-2 py-1 text-xs primary-text" style="background-color: rgba(37, 148, 104, 0.2);">
        Phase: Live conversation
      </span>
    </div>

    <div 
      class="rounded-lg border border-primary/30 bg-primary/5 p-3 transition-all duration-500"
      class:opacity-100={workflowVisible}
      class:opacity-0={!workflowVisible}
      class:translate-y-0={workflowVisible}
      class:translate-y-2={!workflowVisible}
    >
      <div class="mb-2 flex items-center gap-2">
        <div class="h-2 w-2 rounded-full" style="background-color: #259468;"></div>
        <span class="text-sm font-medium primary-text">During Client Call</span>
      </div>
      <div class="text-sm text-gray-300">
        Cli
        <span class="inline-block w-1 h-4 ml-1" 
              style="background-color: #259468;"
              class:opacity-0={!cursorVisible}
              class:opacity-100={cursorVisible}></span>
      </div>
    </div>
    </div>
  </BaseOutcomeCard>

<style>
  @keyframes focus-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(44, 185, 129, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(44, 185, 129, 0);
    }
  }

  .focus-pulse {
    animation: focus-pulse 2s infinite;
  }
</style>
