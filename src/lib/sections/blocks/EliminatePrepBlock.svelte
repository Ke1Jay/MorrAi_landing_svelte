<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import BaseOutcomeCard from './BaseOutcomeCard.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  // Animation constants
  const MEETING_DISPLAY_DURATION = 8000;
  const CONTEXT_TYPING_SPEED = 25;
  const KEY_POINTS_REVEAL_DELAY = 150;

  const MEETING_HEIGHT = 90;

  // State management
  let isVisible = $state(false);
  let currentMeetingIndex = $state(0);
  let displayedContext = $state("");
  let displayedKeyPoints = $state<string[]>([]);
  let isContextExpanded = $state(false);
  let showKeyPoints = $state(false);
  let isPageVisible = $state(true);
  let animationState: 'idle' | 'running' | 'paused' = $state('idle');

  // Refs for cleanup
  let timeouts: NodeJS.Timeout[] = [];

  // Meeting data
  const meetings = [
    {
      id: '1',
      time: '09:00',
      title: 'Product Demo',
      isInternal: false,
      client: 'TechCorp Solutions',
      historicContext: 'Previous demo focused on AI capabilities. Team showed high interest in automation features.',
      keyPoints: [
        'Show automated invoice processing (saves 40hrs/week)',
        'Confirm SOC2 compliance covers their banking reqs',
        'Present 3-tier pricing: $50/100/200 per user/month'
      ],
      endTime: '10:00'
    },
    {
      id: '2',
      time: '10:30',
      title: 'Team Standup',
      isInternal: true,
      historicContext: 'Sprint planning completed yesterday. New feature rollout starting this week.',
      keyPoints: [
        'Sprint goal: Complete user dashboard by Friday',
        'Blocker: API rate limits affecting data sync',
        'Client feedback: Need dark mode by next release'
      ],
      endTime: '11:00'
    },
    {
      id: '3',
      time: '13:00',
      title: 'Integration Planning',
      isInternal: false,
      client: 'DataFlow Inc',
      historicContext: 'Currently using legacy system. Need seamless transition to our platform within 2 months.',
      keyPoints: [
        'Timeline: Migration starts Jan 15, go-live March 1',
        'Data strategy: Parallel run for 2 weeks minimum',
        'Weekly calls: Tuesdays 2PM with tech & business teams'
      ],
      endTime: '13:45'
    },
    {
      id: '4',
      time: '15:30',
      title: 'Quarterly Review',
      isInternal: false,
      client: 'InnovateTech',
      historicContext: 'Strong Q1 performance. Looking to expand usage across more teams.',
      keyPoints: [
        'Q1 results: 45% efficiency gain, 99.2% uptime',
        'Expansion: Add 50 more users across sales & support',
        'Training: 3 sessions next week for new departments'
      ],
      endTime: '17:00'
    },
    {
      id: '5',
      time: '17:00',
      title: 'Security Review',
      isInternal: false,
      client: 'SecureBank Global',
      historicContext: 'Completed initial security assessment. Addressing final compliance requirements.',
      keyPoints: [
        'Audit passed: 2 minor issues fixed, report ready',
        'SOC2 Type II cert delivered, covers all requirements',
        'Go-live: Security features active by end of week'
      ],
      endTime: '18:00'
    }
  ];

  const journeyPoints = [
    { timing: "Morning", description: "Start your day with AI-generated briefs for all meetings" },
    { timing: "Pre-meeting", description: "Client history, recent changes, and talking points automatically prepared" },
    { timing: "End of day", description: "Tomorrow's meetings already analyzed and prepped" }
  ];

  const roles = ["Sales Reps", "Account Execs", "Leaders"];

  // Computed values
  const meetingData = $derived(meetings.map((meeting, index) => ({
    meeting,
    translateY: MEETING_HEIGHT * (index - currentMeetingIndex),
    isCurrent: index === currentMeetingIndex,
    isVisible: index >= currentMeetingIndex - 1 && index <= currentMeetingIndex + 3
  })));

  // Utility functions
  function clearAllTimeouts() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
  }

  function resetAnimationState() {
    displayedContext = "";
    displayedKeyPoints = [];
    isContextExpanded = false;
    showKeyPoints = false;
    clearAllTimeouts();
    animationState = 'idle';
  }

  function typeText(
    text: string,
    setDisplay: (text: string) => void,
    speed: number,
    onComplete?: () => void
  ) {
    if (animationState !== 'running') return;

    let currentIndex = 0;
    
    function typeNextChar() {
      if (animationState !== 'running' || document.hidden) {
        return;
      }

      if (currentIndex <= text.length) {
        setDisplay(text.slice(0, currentIndex));
        
        if (currentIndex === text.length) {
          onComplete?.();
          return;
        }

        const timeout = setTimeout(typeNextChar, speed);
        timeouts.push(timeout);
        currentIndex++;
      }
    }
    
    typeNextChar();
  }

  function typeKeyPoints(
    points: string[],
    onComplete?: () => void
  ) {
    if (animationState !== 'running') return;

    // Simple reveal animation - show points one by one quickly
    displayedKeyPoints = [];
    
    let currentPointIndex = 0;
    
    function revealNextPoint() {
      if (animationState !== 'running' || document.hidden) {
        return;
      }

      if (currentPointIndex >= points.length) {
        onComplete?.();
        return;
      }

      // Add the next point instantly
      displayedKeyPoints = [...displayedKeyPoints, points[currentPointIndex]];
      currentPointIndex++;
      
      // Reveal next point after short delay
      if (currentPointIndex < points.length) {
        const timeout = setTimeout(revealNextPoint, KEY_POINTS_REVEAL_DELAY);
        timeouts.push(timeout);
      } else {
        onComplete?.();
      }
    }

    // Start revealing immediately
    revealNextPoint();
  }

  function startMeetingAnimation() {
    if (!isPageVisible || document.hidden) {
      return;
    }

    animationState = 'running';
    const currentMeeting = meetings[currentMeetingIndex];
    
    // Clear previous meeting's content
    displayedKeyPoints = [];
    displayedContext = "";
    isContextExpanded = false;
    showKeyPoints = false;
    
    // Add a small delay to ensure previous content clears visually
    const clearTimeout = setTimeout(() => {
      if (animationState !== 'running') return;
      
      // Start the new meeting's content
      isContextExpanded = true;
      
      typeText(
        currentMeeting.historicContext,
        (text) => displayedContext = text,
        CONTEXT_TYPING_SPEED,
        () => {
          if (animationState !== 'running') return;
          
          // After context is typed, show key points
          const showKeyPointsTimeout = setTimeout(() => {
            if (animationState !== 'running') return;
            isContextExpanded = false;
            showKeyPoints = true;
            
            typeKeyPoints(currentMeeting.keyPoints, () => {
              if (animationState !== 'running') return;
              
              // Move to next meeting after delay
              if (currentMeetingIndex < meetings.length - 1) {
                const timeout = setTimeout(() => {
                  if (animationState !== 'running') return;
                  currentMeetingIndex++;
                }, MEETING_DISPLAY_DURATION);
                timeouts.push(timeout);
              }
            });
          }, 800);
          timeouts.push(showKeyPointsTimeout);
        }
      );
    }, 200);
    timeouts.push(clearTimeout);
  }

  // Watch for meeting index changes and automatically start next meeting animation
  let isInitialized = $state(false);
  
  $effect(() => {
    // Only react to meeting index changes after initial mount
    if (isInitialized && animationState === 'running' && isPageVisible && !document.hidden) {
      clearAllTimeouts();
      startMeetingAnimation();
    }
  });

  function handleContextToggle() {
    isContextExpanded = !isContextExpanded;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleContextToggle();
    }
  }

  onMount(() => {
    // Initial visibility
    setTimeout(() => {
      isVisible = true;
    }, 100);

    // Page visibility handling
    function handleVisibilityChange() {
      const isVisible = !document.hidden;
      isPageVisible = isVisible;
      
      if (!isVisible) {
        animationState = 'paused';
        clearAllTimeouts();
      } else if (animationState === 'paused') {
        resetAnimationState();
        const restartTimeout = setTimeout(() => {
          if (!document.hidden) {
            animationState = 'running';
            startMeetingAnimation();
            // Re-initialize if needed
            if (!isInitialized) {
              setTimeout(() => {
                isInitialized = true;
              }, 500);
            }
          }
        }, 100);
        timeouts.push(restartTimeout);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    if (isPageVisible) {
      animationState = 'running';
      startMeetingAnimation();
      // Mark as initialized after a short delay to allow first animation to start
      setTimeout(() => {
        isInitialized = true;
      }, 500);
    }

    return () => {
      clearAllTimeouts();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  onDestroy(() => {
    clearAllTimeouts();
  });
</script>

  <BaseOutcomeCard
    icon="🕐"
    title="Eliminate Prep Work"
    description="Focus on selling while AI handles the operational heavy lifting before you even ask."
    {journeyPoints}
    {roles}
    {isVisible}
    class={className}
  >
    <div slot="animation" class="w-full h-full p-4 rounded-lg" style="background-color: #070C0B;">
    <div class="flex gap-4 h-full">
      <!-- Left Side - Meeting Timeline (30%) -->
      <div class="w-[30%] flex flex-col">
        <div class="relative overflow-hidden" style="height: {MEETING_HEIGHT * 4}px">
          <div class="absolute left-1.5 top-0 bottom-0 w-0.5" style="background-color: rgba(16, 185, 129, 0.2);"></div>

          <div class="relative">
            {#each meetingData as { meeting, translateY, isCurrent, isVisible }}
              {#if isVisible}
                <div
                  class="absolute w-full flex items-start gap-3 pb-4 transition-all duration-700 ease-out {isCurrent ? 'opacity-100 scale-100' : 'opacity-60 scale-98'}"
                  style="transform: translateY({translateY}px); height: {MEETING_HEIGHT}px;"
                >
                  <div class="relative mt-0 flex justify-center w-3">
                    <div
                      class="rounded-full transition-all duration-700 {isCurrent ? 'w-3 h-3' : 'w-2 h-2'}"
                      style="background-color: {isCurrent ? '#10b981' : 'rgba(16, 185, 129, 0.5)'}; {isCurrent ? 'box-shadow: 0 0 8px rgba(16,185,129,0.6)' : ''};"
                    >
                      {#if isCurrent && isPageVisible && animationState === 'running'}
                        <div class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
                      {/if}
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div
                      class="text-sm font-medium truncate mb-2"
                      style="color: {isCurrent ? '#10b981' : 'rgba(16, 185, 129, 0.7)'};"
                    >
                      {meeting.title}
                    </div>

                    <div
                      class="text-xs font-medium mb-1"
                      style="color: {isCurrent ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.5)'};"
                    >
                      {meeting.time} - {meeting.endTime}
                    </div>

                    <div
                      class="text-xs"
                      style="color: {isCurrent ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.4)'};"
                    >
                      {meeting.isInternal ? 'Internal Meeting' : meeting.client}
                    </div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Side - Meeting Details (70%) -->
      <div class="flex-1 flex flex-col border-l pl-4" style="border-color: rgba(16, 185, 129, 0.1);">
        <div class="space-y-3 flex-1">
          <!-- Historical Context - Collapsible -->
          <div class="rounded-lg border transition-all duration-500" style="background-color: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.1);">
            <div
              class="flex items-center gap-2 p-3 cursor-pointer focus:outline-none focus:ring-2 rounded-lg transition-all duration-300"
              style="focus:ring-color: rgba(16, 185, 129, 0.5);"
              onclick={handleContextToggle}
              onkeydown={handleKeyDown}
              role="button"
              tabindex="0"
              aria-expanded={isContextExpanded}
              aria-controls="historical-context-content"
            >
              <div class="w-1.5 h-1.5 rounded-full" style="background-color: #10b981;"></div>
              <span class="text-xs font-medium" style="color: rgba(16, 185, 129, 0.8);">Historical Context</span>
              <div
                class="ml-auto transition-transform duration-300 {isContextExpanded ? 'rotate-180' : 'rotate-0'}"
                style="color: rgba(16, 185, 129, 0.6);"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            {#if isContextExpanded}
              <div id="historical-context-content" class="px-3 pb-3">
                <p class="text-sm leading-relaxed min-h-[50px]" style="color: rgba(16, 185, 129, 0.9);">
                  {displayedContext}
                  {#if displayedContext && displayedContext !== meetings[currentMeetingIndex]?.historicContext && isPageVisible && animationState === 'running'}
                    <span class="inline-block w-0.5 h-4 ml-0.5 bg-emerald-400 animate-pulse align-middle"></span>
                  {/if}
                </p>
              </div>
            {/if}
          </div>

          <!-- Key Discussion Points -->
          {#if showKeyPoints}
            <div class="rounded-lg p-3 border flex-1 transition-all duration-500" style="background-color: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.1);">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #10b981;"></div>
                <span class="text-xs font-medium" style="color: rgba(16, 185, 129, 0.8);">Key Discussion Points</span>
              </div>
              <ul class="space-y-2 min-h-[80px]" role="list">
                {#each displayedKeyPoints as point, index (index)}
                  <li 
                    class="text-sm flex items-start gap-2 leading-relaxed key-point-item" 
                    style="color: rgba(16, 185, 129, 0.8);"
                  >
                    <span class="w-1 h-1 rounded-full shrink-0 mt-2" style="background-color: rgba(16, 185, 129, 0.6);"></span>
                    <span class="flex-1">{point}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
    </div>
    </div>
  </BaseOutcomeCard>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .key-point-item {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
  }
</style>
