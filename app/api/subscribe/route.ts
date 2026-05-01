import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: Request) {
  const body = await request.json();
  const { email, phone } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: Save email to your email platform (Mailchimp, Klaviyo, etc.)
  console.log("[hyped.] New subscriber:", email);

  if (phone && typeof phone === "string") {
    if (!accountSid || !authToken || !fromNumber) {
      console.warn("[hyped.] Twilio env vars not set — skipping SMS");
    } else {
      try {
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: "You're on the hyped. list. Drop 001 drops May 15. Stay ready. 🔥 get-hype.store",
          from: fromNumber,
          to: phone,
        });
        console.log("[hyped.] SMS sent to:", phone);
      } catch (err) {
        console.error("[hyped.] SMS failed:", err);
        // Don't fail the whole request if SMS fails
      }
    }
  }

  return NextResponse.json({ success: true });
}
