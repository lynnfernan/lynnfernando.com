import { head } from "@vercel/blob";
import { products as staticProducts, type Product } from "./products";

const BLOB_PATH = "hyped/products-config.json";

export async function getProducts(): Promise<Product[]> {
  try {
    const blob = await head(BLOB_PATH);
    const res = await fetch(blob.url, { next: { revalidate: 30 } });
    if (!res.ok) return staticProducts;
    return await res.json();
  } catch {
    return staticProducts;
  }
}
