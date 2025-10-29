<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import BaseOutcomeCard from './BaseOutcomeCard.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  interface KnowledgeItem {
    id: string;
    category: 'decision' | 'process' | 'insight' | 'pattern';
    team: string;
    timestamp: string;
    title: string;
    content: string;
    relevance: number;
    tags: string[];
  }

  const ANIMATION_CONSTANTS = {
    KNOWLEDGE_CYCLE_DURATION: 4000,
    TYPING_SPEED: 25,
    SEARCH_DURATION: 2000,
  } as const;

  const KNOWLEDGE_BASE: KnowledgeItem[] = [
    {
      id: '1',
      category: 'decision',
      team: 'Sales Team',
      timestamp: '2023-11-12',
      title: 'TechCorp Pricing Objection Resolution',
      content: 'Offered 6-month pilot at 40% discount with full feature access. Client signed annual contract after seeing ROI. Key: show value first, negotiate later.',
      relevance: 96,
      tags: ['pricing', 'objections', 'pilot']
    },
    {
      id: '2',
      category: 'process',
      team: 'Sales Operations',
      timestamp: '2023-09-15',
      title: 'New Rep Onboarding Playbook',
      content: 'Week 1: Shadow 5 calls. Week 2: Lead qualification practice. Week 3: First solo demos. Results: 73% faster ramp-up vs old process.',
      relevance: 92,
      tags: ['onboarding', 'training', 'ramp-up']
    },
    {
      id: '3',
      category: 'insight',
      team: 'Implementation',
      timestamp: '2023-08-22',
      title: 'DataFlow Migration Failure Analysis',
      content: 'Failed due to incomplete data mapping + no rollback plan. Client had 30+ custom fields not documented. Always audit data schema first.',
      relevance: 94,
      tags: ['migration', 'failure', 'data-audit']
    },
    {
      id: '4',
      category: 'pattern',
      team: 'Customer Success',
      timestamp: '2023-12-03',
      title: 'High-Retention Integration Mix',
      content: 'Slack + Salesforce + Google Drive combo shows 91% retention vs 67% single-tool users. Multi-platform adoption = stickiness.',
      relevance: 89,
      tags: ['integrations', 'retention', 'multi-platform']
    }
  ];

  const SEARCH_QUERIES = [
    "Client is pushing back on pricing - how did we handle this before?",
    "New hire asking about our sales process - what's the proven playbook?",
    "Why did the DataFlow migration fail last quarter?",
    "Which integrations actually drove customer retention in 2023?"
  ];

  const CATEGORY_ICONS = {
    decision: '🎯',
    process: '⚙️',
    insight: '💡',
    pattern: '📊'
  } as const;

  // State management
  let isVisible = $state(false);
  let currentKnowledgeIndex = $state(0);
  let currentQueryIndex = $state(0);
  let displayedQuery = $state("");
  let displayedContent = $state("");
  let showResults = $state(false);
  let isSearching = $state(false);
  let showKnowledge = $state(false);
  let isPageVisible = $state(true);
  let isInView = $state(false);
  let animationState = $state<'idle' | 'running' | 'paused'>('idle');

  // Refs for cleanup
  let timeouts: NodeJS.Timeout[] = [];
  let animationContainer: HTMLDivElement;

  // Computed values
  const currentKnowledge = $derived(KNOWLEDGE_BASE[currentKnowledgeIndex]);
  const isTypingQuery = $derived(displayedQuery && displayedQuery !== SEARCH_QUERIES[currentQueryIndex] && isPageVisible);
  const isTypingContent = $derived(displayedContent && displayedContent !== currentKnowledge.content && isPageVisible);

  // Utility functions
  function clearAllTimeouts() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
  }

  function resetAnimationState() {
    displayedQuery = "";
    displayedContent = "";
    showResults = false;
    isSearching = false;
    showKnowledge = false;
    clearAllTimeouts();
  }

  function typeText(
    text: string,
    setDisplay: (text: string) => void,
    speed: number,
    onComplete?: () => void
  ) {
    if (!isPageVisible || document.hidden || animationState !== 'running') return;

    let currentIndex = 0;

    function typeNextChar() {
      // Check visibility and animation state before continuing
      if (!isPageVisible || document.hidden || animationState !== 'running') {
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

  function startKnowledgeAnimation() {
    if (!isPageVisible || document.hidden) return;

    animationState = 'running';
    const currentQuery = SEARCH_QUERIES[currentQueryIndex];
    const currentKnowledge = KNOWLEDGE_BASE[currentKnowledgeIndex];

    resetAnimationState();

    // Step 1: Type the search query
    typeText(currentQuery, (text) => displayedQuery = text, ANIMATION_CONSTANTS.TYPING_SPEED, () => {
      if (!isPageVisible || document.hidden || animationState !== 'running') return;

      // Step 2: Show searching state
      const searchTimeout = setTimeout(() => {
        if (!isPageVisible || document.hidden || animationState !== 'running') return;
        isSearching = true;

        // Step 3: Show results
        const resultsTimeout = setTimeout(() => {
          if (!isPageVisible || document.hidden || animationState !== 'running') return;
          isSearching = false;
          showResults = true;
          showKnowledge = true;

          // Step 4: Type the knowledge content
          const contentTimeout = setTimeout(() => {
            if (!isPageVisible || document.hidden || animationState !== 'running') return;
            typeText(currentKnowledge.content, (text) => displayedContent = text, ANIMATION_CONSTANTS.TYPING_SPEED - 5, () => {
              if (!isPageVisible || document.hidden || animationState !== 'running') return;

              // Step 5: Hold display then cycle to next
              const cycleTimeout = setTimeout(() => {
                if (!isPageVisible || document.hidden || animationState !== 'running') return;
                
                // First, reset and hide current animation state
                resetAnimationState();
                
                // Small delay before updating indices to ensure reset fully propagates
                // This prevents flash of new content before animation starts
                const indexUpdateTimeout = setTimeout(() => {
                  if (!isPageVisible || document.hidden || animationState !== 'running') return;
                  // Update indices (this will trigger $effect which will restart animation)
                  currentQueryIndex = (currentQueryIndex + 1) % SEARCH_QUERIES.length;
                  currentKnowledgeIndex = (currentKnowledgeIndex + 1) % KNOWLEDGE_BASE.length;
                }, 50);
                timeouts.push(indexUpdateTimeout);
              }, ANIMATION_CONSTANTS.KNOWLEDGE_CYCLE_DURATION);
              timeouts.push(cycleTimeout);
            });
          }, 500);
          timeouts.push(contentTimeout);
        }, ANIMATION_CONSTANTS.SEARCH_DURATION);
        timeouts.push(resultsTimeout);
      }, 1000);
      timeouts.push(searchTimeout);
    });
  }

  function handleVisibilityChange() {
    const isCurrentlyVisible = !document.hidden;
    isPageVisible = isCurrentlyVisible;

    if (!isCurrentlyVisible) {
      // Page is hidden - pause animation and clear all timeouts
      animationState = 'paused';
      clearAllTimeouts();
    } else {
      // Page is visible again - restart animation if in viewport
      if (isInView && animationState === 'paused') {
        // Reset everything and restart from current indices
        resetAnimationState();
        // Small delay to ensure clean restart
        const restartTimeout = setTimeout(() => {
          if (!document.hidden && isPageVisible && isInView) {
            animationState = 'running';
            startKnowledgeAnimation();
          }
        }, 150);
        timeouts.push(restartTimeout);
      }
    }
  }

  // Intersection Observer for viewport detection
  onMount(() => {
    // Trigger card visibility animation
    setTimeout(() => {
      isVisible = true;
    }, 300);

    // Handle page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Setup intersection observer after element is bound
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (!animationContainer) return;

      observer = new IntersectionObserver(
        (entries) => {
          isInView = entries[0]?.isIntersecting ?? false;

          if (isInView && isPageVisible && !document.hidden) {
            // Only start if animation is idle or paused
            if (animationState === 'idle' || animationState === 'paused') {
              // Reset indices to 0 only if we're starting fresh
              if (animationState === 'idle') {
                currentQueryIndex = 0;
                currentKnowledgeIndex = 0;
              }
              startKnowledgeAnimation();
            }
          } else {
            // Out of view - pause and reset
            animationState = 'paused';
            clearAllTimeouts();
            resetAnimationState();
            // Don't reset indices, keep them so we can continue where we left off
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
      setTimeout(setupObserver, 100);
    }

    // Track if this is the initial mount to prevent effect from running immediately
    let isInitialMount = true;

    // Watch currentQueryIndex and currentKnowledgeIndex for cycling
    // This restarts the animation when indices change (after cycling)
    $effect(() => {
      // Access the indices to make the effect reactive to their changes
      const _ = currentQueryIndex + currentKnowledgeIndex;
      
      // Skip on initial mount - let intersection observer handle it
      if (isInitialMount) {
        isInitialMount = false;
        return;
      }

      // If indices changed (cycled to next item) and we're in view, restart animation
      if (isInView && isPageVisible && !document.hidden && animationState === 'running') {
        // State is already reset in the cycle timeout
        // Start immediately to prevent any flash (startKnowledgeAnimation calls resetAnimationState first anyway)
        startKnowledgeAnimation();
      }
    });

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
    { timing: "Onboarding", description: "New hires instantly access years of project decisions and context" },
    { timing: "Planning", description: "Surface how other teams solved similar challenges before" },
    { timing: "Strategy", description: "Historical patterns and outcomes inform new initiatives" }
  ];

  const roles = ["Leadership", "New Hires", "Project Managers"];
</script>

  <BaseOutcomeCard
    icon="🧠"
    title="Know Everything, Forget Nothing"
    description="Tap into your organization's collective wisdom. Access institutional knowledge, past decisions, and cross-team insights that would otherwise be lost."
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
      aria-label="Institutional Knowledge Assistant"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="flex flex-col h-full overflow-hidden">
        <!-- Search Interface -->
        <section class="mb-3 flex-shrink-0" aria-labelledby="search-heading">
        <header class="flex items-center gap-2 mb-1.5">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></div>
          <h3 id="search-heading" class="text-xs font-medium text-emerald-500/90">
            Search Company Knowledge
          </h3>
        </header>
        
        <div class="bg-emerald-500/5 rounded-lg border border-emerald-500/10 p-2.5">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400/60 text-xs" aria-hidden="true">🔍</span>
            <div class="flex-1 text-xs text-emerald-300/90 min-h-[16px]" role="searchbox" aria-label="Knowledge search query">
              {displayedQuery}
              {#if isTypingQuery}
                <span class="inline-block w-0.5 h-3 ml-1 bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              {/if}
            </div>
            {#if isSearching}
              <div class="flex items-center gap-1" aria-label="Searching knowledge base">
                {#each [0, 150, 300] as delay}
                  <div 
                    class="w-1 h-1 bg-emerald-400 rounded-full animate-ping"
                    style="animation-delay: {delay}ms"
                    aria-hidden="true"
                  ></div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </section>

        <!-- Knowledge Results -->
        {#if showResults}
          <section 
            class="flex-1 min-h-0 transition-all duration-500 overflow-y-auto {showKnowledge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}"
            aria-labelledby="results-heading"
          >
          <header class="flex items-center gap-2 mb-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></div>
            <h3 id="results-heading" class="text-xs font-medium text-emerald-500/90">
              Found in {currentKnowledge.team} Knowledge
            </h3>
            <div class="ml-auto flex items-center gap-1">
              <span class="text-[10px] text-emerald-500/60">Relevance:</span>
              <span class="text-[10px] font-semibold text-emerald-400">
                {currentKnowledge.relevance}%
              </span>
            </div>
          </header>
          
          <article class="bg-emerald-900/20 rounded-lg border border-emerald-500/20 p-3">
            <!-- Header -->
            <header class="flex items-start gap-2 mb-2">
              <span 
                class="text-sm" 
                role="img" 
                aria-label="{currentKnowledge.category} category"
              >
                {CATEGORY_ICONS[currentKnowledge.category]}
              </span>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-semibold text-emerald-400 mb-1 leading-tight">
                  {currentKnowledge.title}
                </h4>
                <div class="flex items-center gap-1.5 text-[10px] text-emerald-500/60">
                  <span>{currentKnowledge.team}</span>
                  <span aria-hidden="true">•</span>
                  <time datetime={currentKnowledge.timestamp}>{currentKnowledge.timestamp}</time>
                </div>
              </div>
            </header>
            
            <!-- Content -->
            <div class="text-xs text-emerald-300/90 leading-relaxed mb-2 min-h-[30px]">
              {displayedContent}
              {#if isTypingContent}
                <span class="inline-block w-0.5 h-3 ml-1 bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              {/if}
            </div>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1" role="list" aria-label="Knowledge tags">
              {#each currentKnowledge.tags.slice(0, 3) as tag}
                <span
                  role="listitem"
                  class="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400/70 rounded-full border border-emerald-500/20"
                >
                  {tag}
                </span>
              {/each}
            </div>
          </article>
          </section>
        {/if}
      </div>
    </div>
  </BaseOutcomeCard>

