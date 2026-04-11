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

type GitTreeItem = {
  path: string;
  type: "blob" | "tree";
};

type GitTreeResponse = {
  tree?: GitTreeItem[];
};

function normalizePath(path: string) {
  const cleaned = path.replace(/\\/g, "/").replace(/^\/+/, "");
  const segments = cleaned.split("/");
  const output: string[] = [];

  for (const segment of segments) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      output.pop();
      continue;
    }

    output.push(segment);
  }

  return output.join("/");
}

function isImagePath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();

  if (!ext) {
    return false;
  }

  return Boolean(MIME_TYPES[ext]);
}

async function fetchGitHubAsset(config: ReturnType<typeof getObsidianNotesConfig>, path: string) {
  const params = new URLSearchParams({ ref: config.branch });

  return fetch(
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
}

async function findAssetByBasename(config: ReturnType<typeof getObsidianNotesConfig>, basename: string) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees/${encodeURIComponent(
      config.branch
    )}?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
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
    return null;
  }

  const payload = (await response.json()) as GitTreeResponse;
  const matches = (payload.tree || []).filter(
    (item) =>
      item.type === "blob" &&
      isImagePath(item.path) &&
      item.path.split("/").pop()?.toLowerCase() === basename.toLowerCase()
  );

  if (matches.length === 0) {
    return null;
  }

  const preferred = matches.find(
    (item) => item.path === config.notesPath || item.path.startsWith(`${config.notesPath}/`)
  );

  return preferred?.path || matches[0].path;
}

export async function GET(request: NextRequest) {
  const rawPath = request.nextUrl.searchParams.get("path")?.trim();
  const config = getObsidianNotesConfig();

  if (!config.token) {
    return new NextResponse("Missing GITHUB_NOTES_TOKEN", { status: 500 });
  }

  if (!rawPath) {
    return new NextResponse("Missing path", { status: 400 });
  }

  const path = normalizePath(rawPath);

  if (!path) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  if (!isImagePath(path)) {
    return new NextResponse("Unsupported asset type", { status: 400 });
  }

  const candidates = [path];

  if (!path.includes("/")) {
    candidates.push(`${config.notesPath}/${path}`);
  }

  let response: Response | null = null;
  let resolvedPath = path;

  for (const candidate of candidates) {
    const res = await fetchGitHubAsset(config, candidate);

    if (res.ok) {
      response = res;
      resolvedPath = candidate;
      break;
    }

    if (res.status !== 404) {
      response = res;
      resolvedPath = candidate;
      break;
    }
  }

  if (!response || response.status === 404) {
    const basename = path.split("/").pop();
    const foundPath = basename ? await findAssetByBasename(config, basename) : null;

    if (foundPath) {
      const res = await fetchGitHubAsset(config, foundPath);

      if (res.ok) {
        response = res;
        resolvedPath = foundPath;
      } else {
        response = res;
        resolvedPath = foundPath;
      }
    }
  }

  if (!response || !response.ok) {
    return new NextResponse("Asset fetch failed", { status: response?.status || 404 });
  }

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": getMimeType(resolvedPath),
      "Cache-Control": "public, max-age=300",
    },
  });
}
