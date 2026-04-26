"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  function updateField(slug: string, field: keyof Product, value: string) {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-5xl text-white leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            Products
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-1">
            Drop 001 · {products.length} pieces
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF0080] text-white text-xs font-bold px-8 py-3 uppercase tracking-[0.2em] hover:bg-[#cc0066] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Publish Changes"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.slug}
            className="bg-[#111] border border-white/10 overflow-hidden"
          >
            {/* Image preview */}
            <div className="relative aspect-[4/5] bg-[#1a1a1a]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover opacity-70"
                  unoptimized
                />
              )}
              {!product.image && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600 text-xs uppercase tracking-widest">No image</p>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
                  Image URL
                </label>
                <input
                  value={product.image}
                  onChange={(e) => updateField(product.slug, "image", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-transparent border-b border-white/10 text-white text-xs py-1 focus:outline-none focus:border-[#FF0080] transition-colors placeholder:text-gray-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
                  Name
                </label>
                <input
                  value={product.name}
                  onChange={(e) => updateField(product.slug, "name", e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 text-white text-sm py-1 focus:outline-none focus:border-[#FF0080] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
                  Category
                </label>
                <input
                  value={product.category}
                  onChange={(e) => updateField(product.slug, "category", e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 text-white text-sm py-1 focus:outline-none focus:border-[#FF0080] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateField(product.slug, "description", e.target.value)}
                  rows={3}
                  className="w-full bg-transparent border-b border-white/10 text-white text-sm py-1 focus:outline-none focus:border-[#FF0080] transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-600 text-sm text-center mt-20">Loading products...</p>
      )}
    </div>
  );
}
