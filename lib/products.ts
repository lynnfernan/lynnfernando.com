export interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  badge: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=750&fit=crop&q=80`;

export const products: Product[] = [
  {
    slug: "classic-hoodie",
    name: "Classic Hoodie",
    category: "Hoodies",
    description:
      "Heavyweight fleece in a relaxed silhouette. Kangaroo pocket, unisex fit. The go-to piece for the whole crew.",
    image: "/images/hoodie-grey.jpg",
    badge: "DROP 001",
  },
  {
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Hoodies",
    description:
      "Extended length, boxy cut. Built for the streets, designed for everywhere. As seen on the block.",
    image: "/images/hoodie-black.jpg",
    badge: "DROP 001",
  },
  {
    slug: "baggy-sweatpants",
    name: "Baggy Sweatpants",
    category: "Sweatpants",
    description:
      "Relaxed fit with tapered ankle. Elastic waistband, deep side pockets. Comfort that never compromises.",
    image: u("1506792006827-cd291be090da"),
    badge: "DROP 001",
  },
  {
    slug: "cargo-shorts",
    name: "Cargo Shorts",
    category: "Shorts",
    description:
      "Six-pocket utility shorts with a relaxed inseam. Durable canvas fabric, built for every season.",
    image: u("1571945153237-4929e783af4a"),
    badge: "DROP 001",
  },
  {
    slug: "baggy-jeans",
    name: "Baggy Jeans",
    category: "Jeans",
    description:
      "Loose-fit denim with a low-rise waist and wide leg. Raw hem, faded wash. The statement piece of the drop.",
    image: u("1544441893-675973e31985"),
    badge: "DROP 001",
  },
];
