export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tag: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "Sarah M.",
    avatar: "SM",
    date: "2 hours ago",
    title: "I talked to a stranger today and it changed my whole week",
    content:
      "I was sitting in a coffee shop working on my laptop and the person next to me complimented my sticker. Instead of just saying thanks, I actually started a conversation. We talked for 45 minutes. Turns out she just moved to the city and was feeling really isolated. We exchanged numbers and are getting coffee again Friday. Such a small moment but it reminded me that connection is everywhere if you're open to it.",
    likes: 47,
    comments: 12,
    tag: "Story",
  },
  {
    id: "2",
    author: "Marcus K.",
    avatar: "MK",
    date: "5 hours ago",
    title: "Hosting my first dinner party — terrified but excited",
    content:
      "I've been lurking in this community for a while and the 'Host Your First Gathering' guide finally pushed me to do it. I invited 6 people over for dinner this Saturday. Half of them don't know each other. I'm using the conversation cards as an icebreaker. Will report back on how it goes!",
    likes: 83,
    comments: 24,
    tag: "Community",
  },
  {
    id: "3",
    author: "Priya T.",
    avatar: "PT",
    date: "1 day ago",
    title: "The digital detox week changed my relationship with my phone",
    content:
      "Did the 7-day challenge from the blog and wow. Day 3 (no phone in the morning) was the hardest but also the most eye-opening. I realized I'd been starting every single day by comparing myself to other people on Instagram. By day 7, I felt calmer, more present, and actually bored in a good way — like my brain was finally quiet enough to think.",
    likes: 126,
    comments: 31,
    tag: "Digital Wellness",
  },
  {
    id: "4",
    author: "James L.",
    avatar: "JL",
    date: "1 day ago",
    title: "Advice needed: how do you make friends after college?",
    content:
      "Graduated 2 years ago, moved to a new city for work. I have coworkers but no real friends here. Everyone says 'join a club' but I'm not really a joiner. What actually worked for you? Looking for real advice, not the generic stuff.",
    likes: 215,
    comments: 67,
    tag: "Question",
  },
  {
    id: "5",
    author: "Elena R.",
    avatar: "ER",
    date: "2 days ago",
    title: "I stopped performing 'fun' and found real joy",
    content:
      "For years I was the 'life of the party' person. Always on, always performing. It was exhausting and I felt like nobody actually knew me. This year I started saying no to things I didn't want to do, sharing my real opinions, and letting myself be quiet sometimes. I lost some friends. But the ones who stayed? They actually know me now. Quality over quantity isn't just a cliché.",
    likes: 189,
    comments: 43,
    tag: "Authenticity",
  },
  {
    id: "6",
    author: "David W.",
    avatar: "DW",
    date: "3 days ago",
    title: "Started a weekly 'no phones' dinner with roommates",
    content:
      "We put a basket by the door and phones go in it during dinner. First week was awkward — we kept reaching for them out of habit. By week 3 we were having actual conversations. Last night we talked for 2 hours after finishing eating. Can't recommend this enough.",
    likes: 94,
    comments: 18,
    tag: "Community",
  },
];
