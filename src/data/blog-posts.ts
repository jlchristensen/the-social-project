export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "art-of-small-talk",
    title: "The Art of Small Talk: Why It Matters More Than You Think",
    excerpt:
      "Small talk isn't superficial — it's the gateway to every meaningful relationship you'll ever have. Here's how to get better at it.",
    author: "The Social Project",
    date: "April 8, 2026",
    readTime: "5 min read",
    category: "Social Skills",
    image: "/images/blog/small-talk.jpg",
    content: `Small talk gets a bad reputation. People dismiss it as shallow, awkward, or pointless. But here's the truth: every deep friendship, every business partnership, every romantic relationship started with small talk.

## Why We Avoid It

In the age of screens, we've lost our comfort with casual conversation. We'd rather scroll than say hello. We'd rather text than talk. And slowly, we've become strangers to the people right next to us.

## The Science Behind Connection

Research from Harvard shows that people who engage in regular face-to-face social interactions report 30% higher life satisfaction. Small talk isn't just pleasant — it's essential for our wellbeing.

## Five Ways to Get Better Today

1. **Start with observation** — Comment on something in your shared environment
2. **Ask open-ended questions** — "What brought you here?" beats "Do you come here often?"
3. **Listen actively** — Put your phone away and make eye contact
4. **Share something real** — Vulnerability invites vulnerability
5. **Don't fear the pause** — Silence is natural, not awkward

The next time you're in line for coffee, in an elevator, or at a gathering — say something. You never know where it might lead.`,
  },
  {
    slug: "digital-detox-guide",
    title: "Your 7-Day Digital Detox Guide for Real Connection",
    excerpt:
      "Feeling more connected to your phone than the people around you? This week-long guide will help you reset.",
    author: "The Social Project",
    date: "April 3, 2026",
    readTime: "8 min read",
    category: "Guides",
    image: "/images/blog/digital-detox.jpg",
    content: `We spend an average of 7 hours a day on screens. That's nearly half our waking hours. This guide will help you reclaim your time and reconnect with the world around you.

## Day 1: Awareness
Track your screen time. Don't change anything — just notice.

## Day 2: No Phone at Meals
Put it in another room. Be present with whoever you're eating with — even if it's just yourself.

## Day 3: Morning Without Screens
Don't check your phone for the first hour after waking up. Journal, stretch, or just sit with your thoughts.

## Day 4: Social Media Sunset
No social media after 6 PM. Use that time to call a friend or take a walk.

## Day 5: Face-to-Face Day
Make plans to see someone in person. Coffee, a walk, anything.

## Day 6: The Full Evening Off
No screens after dinner. Read, play a game, have a conversation.

## Day 7: Reflect and Commit
How did the week feel? What will you keep doing?

Remember: technology isn't the enemy. But it should serve your life, not replace it.`,
  },
  {
    slug: "being-yourself-is-enough",
    title: "Being Yourself Is Enough: A Letter to the Over-Thinkers",
    excerpt:
      "You don't need a personality makeover. You just need permission to be who you already are.",
    author: "The Social Project",
    date: "March 28, 2026",
    readTime: "4 min read",
    category: "Authenticity",
    image: "/images/blog/authenticity.jpg",
    content: `If you've ever walked into a room and immediately started performing — louder, funnier, more agreeable than you actually feel — this is for you.

## The Performance Trap

We live in a world that rewards personal branding. Every interaction becomes a pitch. Every conversation becomes content. And somewhere along the way, we forgot how to just... be.

## What Authenticity Actually Looks Like

Authenticity isn't about being brutally honest or oversharing. It's about:

- **Saying what you mean** instead of what you think people want to hear
- **Admitting when you don't know** instead of pretending
- **Showing your real interests** instead of performing "cool"
- **Being okay with not being liked by everyone**

## The Paradox

Here's the beautiful irony: the more authentic you are, the more people are drawn to you. Not everyone — but the right ones. The ones who actually see you.

## Start Small

You don't need a grand transformation. Start by catching yourself in one moment of performance today. Then choose honesty instead. That's it. That's the whole practice.

You are enough, exactly as you are.`,
  },
  {
    slug: "loneliness-epidemic",
    title: "The Loneliness Epidemic: What Nobody's Talking About",
    excerpt:
      "We're more connected than ever and lonelier than ever. Understanding why is the first step to changing it.",
    author: "The Social Project",
    date: "March 20, 2026",
    readTime: "6 min read",
    category: "Research",
    image: "/images/blog/loneliness.jpg",
    content: `The U.S. Surgeon General called it an epidemic. Research shows loneliness is as harmful as smoking 15 cigarettes a day. And it's hitting young adults the hardest.

## The Numbers

- 61% of young adults report feeling seriously lonely
- The average American hasn't made a new close friend in 5 years
- Time spent with friends has dropped 30% since 2014

## Why It's Happening

It's not just about phones. It's a perfect storm of remote work, social media comparison, geographic mobility, and a culture that prizes independence over interdependence.

## What We Can Do

1. **Normalize the conversation** — Talking about loneliness isn't weakness
2. **Invest in third places** — Spaces that aren't home or work where community happens
3. **Make the first move** — Someone has to reach out first. Let it be you.
4. **Build rituals** — Weekly dinner, morning walks, game nights. Consistency builds closeness.

This isn't a personal failure. It's a societal challenge. And the solution is beautifully simple: we just need to show up for each other.`,
  },
];
