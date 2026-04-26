import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hyped_admin");
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? "").toString("base64");
  return token?.value === expected;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File;
  const slug = form.get("slug") as string;

  if (!file || !slug) {
    return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const blob = await put(`hyped/products/${slug}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
