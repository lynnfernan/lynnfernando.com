"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  async function handleImageUpload(slug: string, file: File) {
    setUploading(slug);
    const form = new FormData();
    form.append("file", file);
    form.append("slug", slug);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await res.json();
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, image: url } : p))
    );
    setUploading(null);
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
            {/* Image */}
            <div
              className="relative aspect-[4/5] bg-[#1a1a1a] cursor-pointer group"
              onClick={() => fileRefs.current[product.slug]?.click()}
            >
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover opacity-70"
                  unoptimized={product.image.startsWith("/")}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs uppercase tracking-widest font-bold">
                  {uploading === product.slug ? "Uploading..." : "Change Photo"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => { fileRefs.current[product.slug] = el; }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(product.slug, file);
                }}
              />
            </div>

            {/* Fields */}
            <div className="p-4 flex flex-col gap-3">
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
