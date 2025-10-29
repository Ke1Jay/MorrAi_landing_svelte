export interface ProactiveAIContent {
  badge: {
    text: string;
  };
  headline: {
    primary: string;
    secondary: string;
    accent: string;
  };
  description: string;
  blocks: ProactiveAIBlock[];
}

export interface ProactiveAIBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: {
    type: 'meetings' | 'analytics' | 'knowledge' | 'workflow';
    data: any;
  };
  actions: string[];
  roles: string[];
}

export const proactiveAIContent: ProactiveAIContent = {
  badge: {
    text: "Proactive AI"
  },
  headline: {
    primary: "AI-Powered Outcomes for",
    secondary: "Every Sales Role",
    accent: "Every Sales Role"
  },
  description: "From meeting prep to deal insights, Morr.ai helps teams achieve better results with less effort through AI that works before you ask.",
  blocks: [
    {
      id: "eliminate-prep",
      title: "Eliminate Prep Work",
      description: "Focus on selling while AI handles the operational heavy lifting before you even ask.",
      icon: "🕐",
      content: {
        type: "meetings",
        data: {
          meetings: [
            { title: "Team Standup", time: "10:30 - 11:00", type: "Internal Meeting" },
            { title: "Integration Planning", time: "13:00 - 13:45", type: "DataFlow Inc" },
            { title: "Quarterly Review", time: "15:30 - 17:00", type: "InnovateTech" }
          ],
          context: {
            label: "Historical Context",
            text: "Sprint planning completed yesterday. New f|",
            hasCursor: true
          }
        }
      },
      actions: [
        "Morning: Start your day with AI-generated briefs for all meetings",
        "Pre-meeting: Client history, recent changes, and talking points automatically prepared",
        "End of day: Tomorrow's meetings already analyzed and prepped"
      ],
      roles: ["Sales Reps", "Account Execs", "Leaders"]
    },
    {
      id: "smarter-decisions",
      title: "Make Smarter Decisions",
      description: "Access real-time analytics that highlight risks and opportunities across your entire pipeline.",
      icon: "📊",
      content: {
        type: "analytics",
        data: {
          alerts: [
            {
              type: "risk",
              label: "Deal Risk Alert",
              percentage: "87%",
              text: "Acme Corp deal likely to delay 2 weeks based on communication patterns"
            },
            {
              type: "recommendation",
              label: "Recommended Action",
              text: "Call John Smith today - address pricing concerns"
            }
          ]
        }
      },
      actions: [
        "Planning: Predictive forecasting and trend analysis at your fingertips",
        "Mid-quarter: Early warning system for at-risk deals",
        "Reviews: Automated performance insights across all reps"
      ],
      roles: ["Sales Leaders", "Operations", "Executives"]
    },
    {
      id: "know-everything",
      title: "Know Everything, Forget Nothing",
      description: "Tap into your organization's collective wisdom. Access institutional knowledge, past decisions, and cross-team insights that would otherwise be lost.",
      icon: "🧠",
      content: {
        type: "knowledge",
        data: {
          search: {
            label: "Search Company Knowledge",
            text: "New hire asking about our sales process |",
            hasCursor: true
          }
        }
      },
      actions: [
        "Onboarding: New hires instantly access years of project decisions and context",
        "Planning: Surface how other teams solved similar challenges before",
        "Strategy: Historical patterns and outcomes inform new initiatives"
      ],
      roles: ["Leadership", "New Hires", "Project Managers"]
    },
    {
      id: "focus-matters",
      title: "Focus on What Matters",
      description: "Let AI handle research and follow-ups while you focus on building client relationships.",
      icon: "🎯",
      content: {
        type: "workflow",
        data: {
          phase: "Live conversation",
          context: {
            label: "During Client Call",
            text: "Cli|",
            hasCursor: true
          }
        }
      },
      actions: [
        "Before calls: Complete client context and competitive intelligence",
        "During: Real-time access to relevant information",
        "After: Automated follow-ups and next step tracking"
      ],
      roles: ["Sales Reps", "Account Execs", "Success"]
    }
  ]
};
