import { NextResponse } from "next/server";

const EMAIL = process.env.CONTACT_TO_EMAIL || "hello@persidian.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Persidian <hello@persidian.com>";

function sanitize(input: string) {
  return input.trim().replace(/\r/g, "").slice(0, 2000);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, org, message } = body as Record<string, unknown>;

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const cleanName = typeof name === "string" ? sanitize(name) : "";
  const cleanOrg = typeof org === "string" ? sanitize(org) : "";
  const cleanMessage = sanitize(message);

  if (cleanMessage.length > 2000) {
    return NextResponse.json(
      { error: "Message must be under 2000 characters" },
      { status: 400 }
    );
  }

  const subject = `Persidian — deck request from ${cleanOrg || cleanName || "interested party"}`;
  const composedBody = [
    `Name: ${cleanName || "Not provided"}`,
    `Organisation: ${cleanOrg || "Not provided"}`,
    "",
    cleanMessage,
  ].join("\n");

  const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(composedBody)}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: EMAIL,
          subject,
          text: composedBody,
        }),
      });

      if (!resendResponse.ok) {
        const details = await resendResponse.text();
        return NextResponse.json(
          { error: "Failed to send email", details },
          { status: 502 }
        );
      }

      return NextResponse.json({ sent: true, mailtoUrl, subject, body: composedBody, to: EMAIL });
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to send email", details: String(err) },
        { status: 502 }
      );
    }
  }

  // No email provider configured: give the client a clean mailto fallback
  // plus the composed message so the UI can offer copy/share actions.
  return NextResponse.json({
    sent: false,
    mailtoUrl,
    subject,
    body: composedBody,
    to: EMAIL,
  });
}
