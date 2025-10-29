<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import BaseOutcomeCard from './BaseOutcomeCard.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  interface DecisionInsight {
    type: 'prediction' | 'risk' | 'opportunity' | 'recommendation';
    title: string;
    description: string;
    confidence: number;
    priority: 'critical' | 'high' | 'medium';
    action: string;
  }

  const DECISION_INSIGHTS: DecisionInsight[] = [
    {
      type: 'prediction',
      title: 'Deal Risk Alert',
      description: 'Acme Corp deal likely to delay 2 weeks based on communication patterns',
      confidence: 87,
      priority: 'critical',
      action: 'Call John Smith today - address pricing concerns'
    },
    {
      type: 'opportunity',
      title: 'Expansion Opportunity',
      description: 'TechStart showing 3x usage growth - prime for upsell conversation',
      confidence: 94,
      priority: 'high',
      action: 'Schedule Pro features demo with IT team this week'
    },
    {
      type: 'recommendation',
      title: 'Resource Reallocation',
      description: 'Move 2 reps from Enterprise to SMB - 23% efficiency gain predicted',
      confidence: 78,
      priority: 'medium',
      action: 'Reassign Sarah and Mike to SMB next quarter'
    },
    {
      type: 'risk',
      title: 'Churn Prevention',
      description: 'Global Solutions engagement down 40% - immediate intervention needed',
      confidence: 91,
      priority: 'critical',
      action: 'Deploy success specialist within 48hrs for health check'
    }
  ];

  const INSIGHT_ICONS = {
    prediction: '🔮',
    risk: '⚠️',
    opportunity: '🎯',
    recommendation: '💡'
  } as const;

  const PRIORITY_STYLES = {
    critical: 'border-red-400/40 bg-red-500/10 text-red-400',
    high: 'border-orange-400/40 bg-orange-500/10 text-orange-400',
    medium: 'border-yellow-400/40 bg-yellow-500/10 text-yellow-400'
  } as const;

  // State management
  let isVisible = $state(false);
  let currentInsightIndex = $state(0);
  let showInsights = $state(false);
  let showRecommendations = $state(false);
  let confidenceAnimated = $state(false);
  let isPageVisible = $state(true);

  // Refs for cleanup
  let timeouts: NodeJS.Timeout[] = [];
  let intervalId: NodeJS.Timeout | null = null;
  let animationContainer: HTMLDivElement;

  // Computed values
  const currentInsight = $derived(DECISION_INSIGHTS[currentInsightIndex]);

  // Utility functions
  function clearAllTimeouts() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startCycling() {
    if (intervalId) return; // Already running

    intervalId = setInterval(() => {
      if (!isPageVisible || document.hidden) return;

      // Phase 1: Hide current recommendation
      showRecommendations = false;
      confidenceAnimated = false;

      const timeout1 = setTimeout(() => {
        if (!isPageVisible || document.hidden) return;
        
        // Phase 2: Change insight content
        currentInsightIndex = (currentInsightIndex + 1) % DECISION_INSIGHTS.length;

        const timeout2 = setTimeout(() => {
          if (!isPageVisible || document.hidden) return;
          
          // Phase 3: Show new recommendation
          showRecommendations = true;
        }, 200);

        const timeout3 = setTimeout(() => {
          if (!isPageVisible || document.hidden) return;
          
          // Phase 4: Animate confidence bar
          confidenceAnimated = true;
        }, 300);

        timeouts.push(timeout2, timeout3);
      }, 600);

      timeouts.push(timeout1);
    }, 3500);
  }

  function restartAnimations() {
    clearAllTimeouts();

    // Reset to clean state
    showRecommendations = false;
    confidenceAnimated = false;

    // Restart with proper timing
    const timeout1 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      showRecommendations = true;
    }, 200);

    const timeout2 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      confidenceAnimated = true;
    }, 400);

    // Resume cycling
    const timeout3 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      startCycling();
    }, 1000);

    timeouts.push(timeout1, timeout2, timeout3);
  }

  function startInitialAnimation() {
    clearAllTimeouts();

    const timeout1 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      showInsights = true;
    }, 300);

    const timeout2 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      showRecommendations = true;
    }, 800);

    const timeout3 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      confidenceAnimated = true;
    }, 1000);

    const timeout4 = setTimeout(() => {
      if (!isPageVisible || document.hidden) return;
      startCycling();
    }, 1400);

    timeouts.push(timeout1, timeout2, timeout3, timeout4);
  }

  function handleVisibilityChange() {
    const isCurrentlyVisible = !document.hidden;
    isPageVisible = isCurrentlyVisible;

    if (!isCurrentlyVisible) {
      // Page is hidden - pause all animations
      clearAllTimeouts();
    } else {
      // Page is visible again - restart animations
      restartAnimations();
    }
  }

  onMount(() => {
    // Trigger card visibility animation
    setTimeout(() => {
      isVisible = true;
    }, 200);

    // Handle page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Setup intersection observer after element is bound
    let observer: IntersectionObserver | null = null;
    
    const setupObserver = () => {
      if (!animationContainer) return;

      observer = new IntersectionObserver(
        (entries) => {
          const inView = entries[0]?.isIntersecting ?? false;
          
          if (inView && isPageVisible) {
            startInitialAnimation();
          } else {
            // Reset when out of view
            clearAllTimeouts();
            showInsights = false;
            showRecommendations = false;
            confidenceAnimated = false;
            currentInsightIndex = 0;
          }
        },
        {
          threshold: 0.3,
          rootMargin: '20px 0px'
        }
      );

      observer.observe(animationContainer);
    };

    // Try to setup observer immediately, or wait a bit for element to be bound
    if (animationContainer) {
      setupObserver();
    } else {
      // Fallback: setup after a short delay
      setTimeout(setupObserver, 100);
    }

    return () => {
      clearAllTimeouts();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) {
        observer.disconnect();
      }
    };
  });

  onDestroy(() => {
    clearAllTimeouts();
  });

  const journeyPoints = [
    { timing: "Planning", description: "Predictive forecasting and trend analysis at your fingertips" },
    { timing: "Mid-quarter", description: "Early warning system for at-risk deals" },
    { timing: "Reviews", description: "Automated performance insights across all reps" }
  ];

  const roles = ["Sales Leaders", "Operations", "Executives"];
</script>

  <BaseOutcomeCard
    icon="📊"
    title="Make Smarter Decisions"
    description="Access real-time analytics that highlight risks and opportunities across your entire pipeline."
    {journeyPoints}
    {roles}
    {isVisible}
    class={className}
  >

    <div 
      bind:this={animationContainer}
      slot="animation" 
      class="w-full h-full p-4 rounded-lg"
      style="background-color: #070C0B;"
      role="region"
      aria-label="Decision Intelligence Dashboard"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="flex flex-col h-full">
        <!-- Header - Decision Insight -->
        <header 
          class="mb-4 transition-all duration-500 ease-out"
          style="opacity: {showInsights ? 1 : 0}; transform: {showInsights ? 'translateY(0)' : 'translateY(15px)'}"
        >
          <div class="flex items-center gap-2 mb-3">
            <div 
              class="w-2 h-2 rounded-full bg-emerald-500"
              style="animation: {showInsights ? 'pulse 2s infinite' : 'none'}"
              aria-hidden="true"
            ></div>
            <span class="text-sm font-medium text-emerald-500/90">Live Decision Support</span>
            <div class="ml-auto text-xs text-emerald-500/60">AI-Powered</div>
          </div>
          
          <div class="p-3 rounded-lg border {PRIORITY_STYLES[currentInsight.priority]} transition-all duration-500">
            <div class="flex items-start gap-2">
              <span class="text-sm" role="img" aria-label="{currentInsight.type} indicator">
                {INSIGHT_ICONS[currentInsight.type]}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm font-semibold text-[#2fcb8d]/90">{currentInsight.title}</h3>
                  <div 
                    class="flex items-center gap-1" 
                    role="progressbar" 
                    aria-valuenow={currentInsight.confidence} 
                    aria-valuemin={0} 
                    aria-valuemax={100} 
                    aria-label="Confidence: {currentInsight.confidence}%"
                  >
                    <div class="w-8 h-1 bg-[#2fcb8d]/10 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-[#2fcb8d]/60 transition-all duration-1000 ease-out"
                        style="width: {confidenceAnimated ? currentInsight.confidence : 0}%"
                      ></div>
                    </div>
                    <span class="text-sm text-[#2fcb8d]/60 font-medium" aria-hidden="true">
                      {currentInsight.confidence}%
                    </span>
                  </div>
                </div>
                <p class="text-sm text-[#2fcb8d]/80 leading-relaxed">
                  {currentInsight.description}
                </p>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content - Action Recommendation -->
        <main class="flex-1 min-h-0">
          <div 
            class="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20 ml-6 transition-all duration-600"
            style="opacity: {showRecommendations ? 1 : 0}; transform: {showRecommendations ? 'translateX(0)' : 'translateX(-20px)'}"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></div>
              <span class="text-sm font-semibold text-emerald-500/90">Recommended Action</span>
            </div>
            <div class="text-sm text-emerald-500/90">
              {currentInsight.action}
            </div>
          </div>
        </main>
      </div>
    </div>
  </BaseOutcomeCard>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
