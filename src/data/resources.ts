export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "guide" | "worksheet" | "video" | "book";
  icon: string;
  link: string;
}

export const resourceCategories = [
  "All",
  "Social Skills",
  "Authenticity",
  "Digital Wellness",
  "Community Building",
] as const;

export const resources: Resource[] = [
  {
    id: "1",
    title: "Conversation Starter Pack",
    description:
      "50 genuine conversation starters that go beyond 'How are you?' — organized by setting and comfort level.",
    category: "Social Skills",
    type: "guide",
    icon: "💬",
    link: "#",
  },
  {
    id: "2",
    title: "The Authenticity Workbook",
    description:
      "A self-paced workbook to help you identify your values, set boundaries, and show up as your real self.",
    category: "Authenticity",
    type: "worksheet",
    icon: "📓",
    link: "#",
  },
  {
    id: "3",
    title: "Screen Time Reset Challenge",
    description:
      "A 21-day challenge to build healthier tech habits and make room for real-world connection.",
    category: "Digital Wellness",
    type: "guide",
    icon: "📱",
    link: "#",
  },
  {
    id: "4",
    title: "How to Build Your Own Community",
    description:
      "A step-by-step guide to starting a local meetup, dinner club, or social group from scratch.",
    category: "Community Building",
    type: "guide",
    icon: "🤝",
    link: "#",
  },
  {
    id: "5",
    title: "The Social Confidence Toolkit",
    description:
      "Practical techniques for managing social anxiety, building confidence, and enjoying social situations again.",
    category: "Social Skills",
    type: "guide",
    icon: "🧠",
    link: "#",
  },
  {
    id: "6",
    title: "Recommended Reading List",
    description:
      "Our curated list of the best books on connection, vulnerability, communication, and living authentically.",
    category: "Authenticity",
    type: "book",
    icon: "📚",
    link: "#",
  },
  {
    id: "7",
    title: "Digital Boundaries Template",
    description:
      "Set clear boundaries with technology. Print-friendly template for defining your personal screen time rules.",
    category: "Digital Wellness",
    type: "worksheet",
    icon: "🛡️",
    link: "#",
  },
  {
    id: "8",
    title: "Host Your First Gathering",
    description:
      "Everything you need to plan a meaningful gathering — from invitations to conversation prompts to follow-up.",
    category: "Community Building",
    type: "guide",
    icon: "🎉",
    link: "#",
  },
];
