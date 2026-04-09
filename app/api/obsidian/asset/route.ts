import { NextRequest, NextResponse } from "next/server";
import { getObsidianNotesConfig, OBSIDIAN_NOTES_TAG } from "@/lib/obsidian-notes";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  ico: "image/x-icon",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

function getMimeType(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();

  if (!ext) {
    return "application/octet-stream";
  }

  return MIME_TYPES[ext] || "application/octet-stream";
}

function encodeRepoPath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")?.trim();
  const config = getObsidianNotesConfig();

  if (!config.token) {
    return new NextResponse("Missing GITHUB_NOTES_TOKEN", { status: 500 });
  }

  if (!path) {
    return new NextResponse("Missing path", { status: 400 });
  }

  if (!(path === config.notesPath || path.startsWith(`${config.notesPath}/`))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const params = new URLSearchParams({ ref: config.branch });
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeRepoPath(path)}?${params.toString()}`,
    {
      headers: {
        Accept: "application/vnd.github.raw",
        Authorization: `Bearer ${config.token}`,
        "User-Agent": "blog-obsidian-sync",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: {
        revalidate: 300,
        tags: [OBSIDIAN_NOTES_TAG],
      },
    }
  );

  if (!response.ok) {
    return new NextResponse("Asset fetch failed", { status: response.status });
  }

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": getMimeType(path),
      "Cache-Control": "public, max-age=300",
    },
  });
}
