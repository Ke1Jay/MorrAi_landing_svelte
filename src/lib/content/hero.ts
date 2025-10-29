export interface HeroContent {
  badge: {
    text: string;
    icon?: string;
  };
  headline: {
    primary: string;
    secondary: string;
    accent: string; // The word that should be highlighted in green
  };
  description: string;
  cta: {
    primary: {
      text: string;
      href: string;
      icon?: string;
    };
    secondary: {
      text: string;
      href: string;
    };
    tertiary: {
      text: string;
      href: string;
    };
  };
  trustbar?: {
    text: string;
    logos?: string[];
  };
}

export const heroContent: HeroContent = {
  badge: {
    text: "AI that works before you ask",
    icon: "●"
  },
  headline: {
    primary: "Work Smarter.",
    secondary: "Stay Ahead.",
    accent: "Stay Ahead."
  },
  description: "Morr.ai connects seamlessly with your existing tools, learns your workflow, and proactively anticipates your needs. From preparing meeting briefs to delivering real-time insights and automating tasks.",
  cta: {
    primary: {
      text: "Get Early Access",
      href: "/signup",
      icon: "→"
    },
    secondary: {
      text: "Request Demo",
      href: "/demo"
    },
    tertiary: {
      text: "Join Waitlist",
      href: "/waitlist"
    }
  },
  trustbar: {
    text: "Trusted by forward-thinking teams",
    logos: []
  }
};

