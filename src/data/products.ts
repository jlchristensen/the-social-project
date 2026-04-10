export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "The Social Project Tee",
    description:
      'Classic fit tee with "Igniting Human Connection" on the back. Soft, sustainable cotton.',
    price: 34,
    image: "/images/merch/tee.jpg",
    category: "Apparel",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Connection Crewneck",
    description:
      "Ultra-soft crewneck sweatshirt with embroidered TSP logo. Perfect for coffee shop conversations.",
    price: 58,
    image: "/images/merch/crewneck.jpg",
    category: "Apparel",
  },
  {
    id: "3",
    name: "Be Real Hat",
    description:
      'Minimalist dad hat with "Be Real" stitched in cursive. Adjustable, one size fits all.',
    price: 28,
    image: "/images/merch/hat.jpg",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Conversation Deck",
    description:
      "52 beautifully designed cards with deep conversation prompts. Turn any hangout into something meaningful.",
    price: 22,
    image: "/images/merch/cards.jpg",
    category: "Goods",
    badge: "New",
  },
  {
    id: "5",
    name: "The Social Journal",
    description:
      "A guided journal for building deeper connections. Weekly prompts, gratitude logs, and reflection pages.",
    price: 26,
    image: "/images/merch/journal.jpg",
    category: "Goods",
  },
  {
    id: "6",
    name: "Community Sticker Pack",
    description:
      "Pack of 10 vinyl stickers with Social Project designs. Laptop, water bottle, and phone-ready.",
    price: 12,
    image: "/images/merch/stickers.jpg",
    category: "Accessories",
  },
];
