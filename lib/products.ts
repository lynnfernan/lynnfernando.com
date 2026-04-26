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
      "Heavyweight fleece in an oversized silhouette. Dropped shoulders, kangaroo pocket, unisex fit. The go-to piece for the whole crew.",
    image: u("1552374196-1ab2a1c593e8"),
    badge: "DROP 001",
  },
  {
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Hoodies",
    description:
      "Extended length, boxy cut. Made to layer. Built for the streets, designed for everywhere.",
    image: u("1556821840-3a63f15732ce"),
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
    slug: "wide-leg-sweats",
    name: "Wide-Leg Sweats",
    category: "Sweatpants",
    description:
      "Full wide-leg cut for maximum comfort and maximum presence. Heavy French terry fabric.",
    image: u("1515886657613-9f3515b0c78f"),
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
  {
    slug: "essential-tee",
    name: "Essential Tee",
    category: "T-Shirts",
    description:
      "Premium heavyweight cotton. Oversized boxy cut. The foundational piece for any hyped. fit.",
    image: u("1489987707025-afc232f7ea0f"),
    badge: "DROP 001",
  },
  {
    slug: "graphic-tee",
    name: "Graphic Tee",
    category: "T-Shirts",
    description:
      "Statement graphics on heavyweight cotton. Limited run only — each drop brings a different print.",
    image: u("1523398002811-999ca8dec234"),
    badge: "DROP 001",
  },
];
