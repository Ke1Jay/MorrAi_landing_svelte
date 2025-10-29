<script lang="ts">
  import { cn } from '$lib/utils/classnames';

  interface JourneyPoint {
    timing: string;
    description: string;
  }

  interface Props {
    icon: string;
    title: string;
    description: string;
    journeyPoints: JourneyPoint[];
    roles: string[];
    isVisible?: boolean;
    class?: string;
  }

  let { 
    icon, 
    title, 
    description, 
    journeyPoints, 
    roles, 
    isVisible = true,
    class: className = '' 
  }: Props = $props();
</script>

<div 
  class={cn(
    'proactive-ai-block group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 sm:p-8',
    'border-[#2fcb8d]/10 bg-black/40 backdrop-blur-xl',
    'transition-all duration-300 hover:bg-black/50 hover:border-[#2fcb8d]/20',
    'hover:translate-y-[-2px]',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    className
  )}
>
  <!-- Icon and title -->
  <div class="flex items-center gap-3 mb-5">
    <div class="relative z-10 p-2 rounded-lg bg-[#2fcb8d]/5 text-[#2fcb8d]/80 w-10 h-10 flex items-center justify-center group-hover:bg-[#2fcb8d]/10 group-hover:scale-110 transition-all duration-300">
      <span class="text-2xl">{icon}</span>
      <div class="absolute inset-0 bg-[#2fcb8d]/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
    <h3 class="text-lg font-bold text-[#2fcb8d]/90">
      {title}
    </h3>
  </div>

  <!-- Main description -->
  <p class="text-base leading-relaxed text-[#b4b4b4] mb-5 ml-2">
    {description}
  </p>

  <!-- Animation slot - unique content per block with fixed height constraint -->
  <div class="mb-6 flex-shrink-0 overflow-hidden" style="height: 280px; min-height: 280px; max-height: 280px;">
    <slot name="animation" />
  </div>

  <!-- Journey points -->
  <div class="space-y-3 mb-6">
    {#each journeyPoints as point, index}
      <div
        class="flex items-start gap-12 group-hover:transform group-hover:translate-x-1 transition-transform duration-300 ease-out"
        style="animation-delay: {index * 50}ms"
      >
        <div class="flex-shrink-0 w-20">
          <span class="text-sm font-medium text-[#2fcb8d]/70 px-2 py-0.5 bg-[#2fcb8d]/5 rounded-full whitespace-nowrap inline-block">
            {point.timing}
          </span>
        </div>
        <span class="text-sm text-[#b4b4b4]/70 flex-1">
          {point.description}
        </span>
      </div>
    {/each}
  </div>

  <!-- Role tags -->
  <div class="mt-auto flex flex-wrap gap-2">
    {#each roles as role, index}
      <span
        class="text-sm px-2 py-1 rounded-full bg-black/30 text-[#b4b4b4]/70 border border-[#2fcb8d]/10 group-hover:bg-[#2fcb8d]/5 group-hover:text-[#2fcb8d] group-hover:border-[#2fcb8d]/20 transition-all duration-300"
      >
        {role}
      </span>
    {/each}
  </div>
</div>

