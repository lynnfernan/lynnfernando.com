import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProducts } from "@/lib/products-store";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hyped_admin");
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? "").toString("base64");
  return token?.value === expected;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await request.json();

  await put("hyped/products-config.json", JSON.stringify(products), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json({ success: true });
}
