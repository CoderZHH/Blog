import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { OBSIDIAN_NOTES_TAG, getObsidianNotesConfig } from "@/lib/obsidian-notes";

export const runtime = "nodejs";

type GitHubPushPayload = {
  ref?: string;
  repository?: {
    full_name?: string;
  };
};

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) {
    return false;
  }

  const expected = Buffer.from(
    `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`,
    "utf8"
  );
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_NOTES_WEBHOOK_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Missing GITHUB_NOTES_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");
  const rawBody = await request.text();

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  if (event === "ping") {
    return NextResponse.json({ ok: true, event: "ping" });
  }

  if (event !== "push") {
    return NextResponse.json({ ok: true, skipped: true, reason: "Unsupported event" });
  }

  const payload = JSON.parse(rawBody) as GitHubPushPayload;
  const config = getObsidianNotesConfig();
  const expectedRepo = `${config.owner}/${config.repo}`;
  const expectedRef = `refs/heads/${config.branch}`;

  if (payload.repository?.full_name !== expectedRepo) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Repository mismatch" });
  }

  if (payload.ref !== expectedRef) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Branch mismatch" });
  }

  revalidateTag(OBSIDIAN_NOTES_TAG, "max");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    source: expectedRepo,
    ref: expectedRef,
  });
}
