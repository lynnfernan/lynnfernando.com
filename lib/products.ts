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
      "Heavyweight fleece in an oversized silhouette. Dropped shoulders, kangaroo pocket, unisex fit. The go-to piece for the whole crew.",
    image: "https://picsum.photos/seed/hyped-hoodie1/600/750",
    badge: "DROP 001",
  },
  {
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "Hoodies",
    description:
      "Extended length, boxy cut. Made to layer. Built for the streets, designed for everywhere.",
    image: "https://picsum.photos/seed/hyped-hoodie2/600/750",
    badge: "DROP 001",
  },
  {
    slug: "cropped-hoodie",
    name: "Cropped Hoodie",
    category: "Hoodies",
    description:
      "Cropped silhouette meets streetwear. Heavyweight cotton blend with a clean, modern edge.",
    image: "https://picsum.photos/seed/hyped-hoodie3/600/750",
    badge: "DROP 001",
  },
  {
    slug: "baggy-sweatpants",
    name: "Baggy Sweatpants",
    category: "Sweatpants",
    description:
      "Relaxed fit with tapered ankle. Elastic waistband, deep side pockets. Comfort that never compromises.",
    image: "https://picsum.photos/seed/hyped-sweat1/600/750",
    badge: "DROP 001",
  },
  {
    slug: "wide-leg-sweats",
    name: "Wide-Leg Sweats",
    category: "Sweatpants",
    description:
      "Full wide-leg cut for maximum comfort and maximum presence. Heavy French terry fabric.",
    image: "https://picsum.photos/seed/hyped-sweat2/600/750",
    badge: "DROP 001",
  },
  {
    slug: "cargo-shorts",
    name: "Cargo Shorts",
    category: "Shorts",
    description:
      "Six-pocket utility shorts with a relaxed inseam. Durable canvas fabric, built for every season.",
    image: "https://picsum.photos/seed/hyped-shorts1/600/750",
    badge: "DROP 001",
  },
  {
    slug: "essential-tee",
    name: "Essential Tee",
    category: "T-Shirts",
    description:
      "Premium heavyweight cotton. Oversized boxy cut. The foundational piece for any hyped. fit.",
    image: "https://picsum.photos/seed/hyped-tee1/600/750",
    badge: "DROP 001",
  },
  {
    slug: "graphic-tee",
    name: "Graphic Tee",
    category: "T-Shirts",
    description:
      "Statement graphics on heavyweight cotton. Limited run only — each drop brings a different print.",
    image: "https://picsum.photos/seed/hyped-tee2/600/750",
    badge: "DROP 001",
  },
];
