export interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  badge: string;
}

export const products: Product[] = [
  {
    slug: "classic-hoodie",
    name: "Classic Hoodie",
    category: "Hoodies",
    description:
      "Heavyweight fleece in a relaxed silhouette. Kangaroo pocket, unisex fit. The go-to piece for the whole crew.",
    image: "/hoodie-grey.jpg",
    badge: "DROP 001",
  },
  {
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Hoodies",
    description:
      "Extended length, boxy cut. Built for the streets, designed for everywhere. As seen on the block.",
    image: "/hoodie-black.jpg",
    badge: "DROP 001",
  },
  {
    slug: "baggy-sweatpants",
    name: "Baggy Sweatpants",
    category: "Sweatpants",
    description:
      "Relaxed fit with tapered ankle. Elastic waistband, deep side pockets. Comfort that never compromises.",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop&q=80",
    badge: "DROP 001",
  },
  {
    slug: "cargo-shorts",
    name: "Shorts",
    category: "Shorts",
    description:
      "Six-pocket utility shorts with a relaxed inseam. Durable canvas fabric, built for every season.",
    image: "/grey-shorts.jpg",
    badge: "DROP 001",
  },
  {
    slug: "baggy-jeans",
    name: "Baggy Jeans",
    category: "Jeans",
    description:
      "Loose-fit denim with a low-rise waist and wide leg. Raw hem, faded wash. The statement piece of the drop.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80",
    badge: "DROP 001",
  },
];
