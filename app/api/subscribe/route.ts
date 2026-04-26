import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: Connect to email platform (Mailchimp, Klaviyo, etc.)
  console.log("[hyped.] New subscriber:", email);

  return NextResponse.json({ success: true });
}
