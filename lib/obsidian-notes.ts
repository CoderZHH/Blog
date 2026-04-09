const NOTE_FILE_PATTERN = /\.(md|mdx|markdown)$/i;

const NOTE_LIMIT = 10;
const COMMIT_SCAN_LIMIT = 20;
const NOTES_REVALIDATE_SECONDS = 300;

export const OBSIDIAN_NOTES_TAG = "obsidian-notes";

type ObsidianNotesConfig = {
  owner: string;
  repo: string;
  branch: string;
  notesPath: string;
  token: string | null;
};

type GitHubCommitSummary = {
  sha: string;
};

type GitHubFileContent = {
  content?: string;
  encoding?: string;
};

type GitHubCommitFile = {
  filename: string;
  previous_filename?: string;
  status: string;
};

type GitHubCommitDetail = {
  sha: string;
  commit: {
    author: {
      date: string;
      name: string;
    } | null;
    message: string;
  };
  files?: GitHubCommitFile[];
};

export type ObsidianNoteUpdate = {
  id: string;
  title: string;
  path: string;
  repoPath: string;
  updatedAt: string;
  changeType: "new" | "updated";
  sha: string;
  commitMessage: string;
  excerpt: string;
  content: string;
};

export type ObsidianNotesResult = {
  notes: ObsidianNoteUpdate[];
  configured: boolean;
  error: string | null;
  sourceLabel: string | null;
};

function normalizePath(path: string) {
  return path.trim().replace(/^\/+|\/+$/g, "");
}

export function getObsidianNotesConfig(): ObsidianNotesConfig {
  return {
    owner: process.env.GITHUB_NOTES_OWNER?.trim() || "CoderZHH",
    repo: process.env.GITHUB_NOTES_REPO?.trim() || "ObsdianNote",
    branch: process.env.GITHUB_NOTES_BRANCH?.trim() || "master",
    notesPath: normalizePath(process.env.GITHUB_NOTES_PATH || "开发"),
    token: process.env.GITHUB_NOTES_TOKEN?.trim() || null,
  };
}

function hasRequiredConfig(config: ObsidianNotesConfig) {
  return Boolean(config.owner && config.repo && config.branch && config.notesPath && config.token);
}

function matchesNotesPath(filename: string, notesPath: string) {
  return filename === notesPath || filename.startsWith(`${notesPath}/`);
}

function isTrackableNote(filename: string, notesPath: string) {
  return matchesNotesPath(filename, notesPath) && NOTE_FILE_PATTERN.test(filename);
}

function toRelativePath(filename: string, notesPath: string) {
  if (!filename.startsWith(`${notesPath}/`)) {
    return filename;
  }

  return filename.slice(notesPath.length + 1);
}

function toTitle(filename: string) {
  const basename = filename.split("/").pop() || filename;

  return basename.replace(/\.[^.]+$/, "");
}

function stripFrontmatter(content: string) {
  if (!content.startsWith("---")) {
    return content.trim();
  }

  const end = content.indexOf("\n---", 3);

  if (end === -1) {
    return content.trim();
  }

  return content.slice(end + 4).trim();
}

function toPreviewText(content: string) {
  return stripFrontmatter(content)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/!\[\[[^[\]]+\]\]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\[([^[\]]+)\]\]/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function toExcerpt(content: string) {
  const preview = toPreviewText(content);

  if (preview.length <= 180) {
    return preview;
  }

  return `${preview.slice(0, 180).trim()}...`;
}

function decodeFileContent(payload: GitHubFileContent) {
  if (!payload.content) {
    return "";
  }

  if (payload.encoding === "base64") {
    return Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");
  }

  return payload.content;
}

async function getNoteContent(config: ObsidianNotesConfig, path: string) {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const params = new URLSearchParams({ ref: config.branch });
  const payload = await githubFetch<GitHubFileContent>(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${encodedPath}?${params.toString()}`
  );
  const content = stripFrontmatter(decodeFileContent(payload));

  return {
    content,
    excerpt: toExcerpt(content),
  };
}

async function githubFetch<T>(config: ObsidianNotesConfig, resource: string): Promise<T> {
  const response = await fetch(`https://api.github.com${resource}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "User-Agent": "blog-obsidian-sync",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: {
      revalidate: NOTES_REVALIDATE_SECONDS,
      tags: [OBSIDIAN_NOTES_TAG],
    },
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(`GitHub API ${response.status}: ${detail.slice(0, 180)}`);
  }

  return (await response.json()) as T;
}

function toSourceLabel(config: ObsidianNotesConfig) {
  return `${config.owner}/${config.repo}/${config.notesPath}`;
}

export async function getLatestObsidianNotes(): Promise<ObsidianNotesResult> {
  const config = getObsidianNotesConfig();

  if (!hasRequiredConfig(config)) {
    return {
      notes: [],
      configured: false,
      error: null,
      sourceLabel: toSourceLabel(config),
    };
  }

  try {
    const params = new URLSearchParams({
      sha: config.branch,
      path: config.notesPath,
      per_page: String(COMMIT_SCAN_LIMIT),
    });

    const commits = await githubFetch<GitHubCommitSummary[]>(
      config,
      `/repos/${config.owner}/${config.repo}/commits?${params.toString()}`
    );

    const details = await Promise.all(
      commits.map((commit) =>
        githubFetch<GitHubCommitDetail>(
          config,
          `/repos/${config.owner}/${config.repo}/commits/${commit.sha}`
        )
      )
    );

    const seen = new Set<string>();
    const noteSeeds: Array<
      Omit<ObsidianNoteUpdate, "excerpt" | "content">
    > = [];

    for (const detail of details) {
      for (const file of detail.files || []) {
        if (!isTrackableNote(file.filename, config.notesPath)) {
          continue;
        }

        if (file.status === "removed") {
          continue;
        }

        if (seen.has(file.filename)) {
          continue;
        }

        seen.add(file.filename);

        noteSeeds.push({
          id: `${detail.sha}:${file.filename}`,
          title: toTitle(file.filename),
          path: toRelativePath(file.filename, config.notesPath),
          repoPath: file.filename,
          updatedAt: detail.commit.author?.date || new Date().toISOString(),
          changeType: file.status === "added" ? "new" : "updated",
          sha: detail.sha,
          commitMessage: detail.commit.message.split("\n")[0] || "Updated note",
        });

        if (noteSeeds.length >= NOTE_LIMIT) {
          break;
        }
      }

      if (noteSeeds.length >= NOTE_LIMIT) {
        break;
      }
    }

    const notes = await Promise.all(
      noteSeeds.map(async (note) => {
        const contentData = await getNoteContent(config, note.repoPath);

        return {
          ...note,
          ...contentData,
        };
      })
    );

    if (notes.length > 0) {
      return {
        notes,
        configured: true,
        error: null,
        sourceLabel: toSourceLabel(config),
      };
    }

    return {
      notes,
      configured: true,
      error: null,
      sourceLabel: toSourceLabel(config),
    };
  } catch (error) {
    console.error("Failed to load Obsidian notes from GitHub", error);

    return {
      notes: [],
      configured: true,
      error: "GitHub 笔记同步失败。请检查 GITHUB_NOTES_TOKEN 是否可读取私有仓库，以及分支和路径配置是否正确。",
      sourceLabel: toSourceLabel(config),
    };
  }
}
