import type { ObsidianNoteUpdate } from "./obsidian-notes";

const IMAGE_FILE_PATTERN = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i;

function normalizeSlashes(value: string) {
  return value.replace(/\\/g, "/");
}

function dirname(path: string) {
  const normalized = normalizeSlashes(path);
  const slashIndex = normalized.lastIndexOf("/");

  if (slashIndex === -1) {
    return "";
  }

  return normalized.slice(0, slashIndex);
}

function normalizePath(path: string) {
  const normalized = normalizeSlashes(path);
  const parts = normalized.split("/");
  const output: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      output.pop();
      continue;
    }

    output.push(part);
  }

  return output.join("/");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function isExternalUrl(value: string) {
  return /^(https?:)?\/\//i.test(value) || value.startsWith("data:");
}

function cleanWikiTarget(target: string) {
  const [pathPart, optionPart] = target.split("|");
  const cleanedPath = pathPart.split("#")[0].trim();
  const width = optionPart?.trim();

  return {
    path: cleanedPath,
    width: width && /^\d+$/.test(width) ? width : null,
  };
}

function cleanMarkdownTarget(target: string) {
  const trimmed = target.trim().replace(/^<|>$/g, "");
  const [pathPart] = trimmed.split(/\s+"/);

  return pathPart.trim();
}

export function resolveRepoAssetPath(note: ObsidianNoteUpdate, target: string) {
  const cleaned = normalizeSlashes(target.trim());

  if (!cleaned) {
    return null;
  }

  if (cleaned.startsWith("/")) {
    return normalizePath(cleaned.slice(1));
  }

  const baseDir = dirname(note.repoPath);

  return normalizePath(baseDir ? `${baseDir}/${cleaned}` : cleaned);
}

export function toAssetProxyUrl(note: ObsidianNoteUpdate, target: string) {
  if (isExternalUrl(target)) {
    return target;
  }

  const repoPath = resolveRepoAssetPath(note, target);

  if (!repoPath) {
    return null;
  }

  return `/api/obsidian/asset?path=${encodeURIComponent(repoPath)}`;
}

function renderLinkHtml(label: string, target: string, note: ObsidianNoteUpdate) {
  const text = escapeHtml(label.trim() || target);
  const href = cleanMarkdownTarget(target);

  if (isExternalUrl(href)) {
    return `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer" class="obsidian-md-anchor">${text}</a>`;
  }

  const repoPath = resolveRepoAssetPath(note, href);

  if (!repoPath) {
    return `<span class="obsidian-md-note-link">${text}</span>`;
  }

  return `<span class="obsidian-md-note-link" data-note-path="${escapeAttribute(repoPath)}">${text}</span>`;
}

function renderWikiLinkHtml(target: string) {
  const [pathPart, aliasPart] = target.split("|");
  const [cleanedPath] = pathPart.split("#");
  const display = aliasPart?.trim() || cleanedPath.trim();

  return `<span class="obsidian-md-note-link">${escapeHtml(display)}</span>`;
}

function renderImageHtml(target: string, alt: string, note: ObsidianNoteUpdate, width?: string | null) {
  const src = toAssetProxyUrl(note, target);

  if (!src) {
    return `<span class="obsidian-md-broken-image">[missing image]</span>`;
  }

  const widthStyle = width ? ` style="max-width:${escapeAttribute(width)}px"` : "";

  return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" class="obsidian-md-image"${widthStyle} />`;
}

function applyInlineFormatting(input: string) {
  return input
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
}

function renderInlineHtml(text: string, note: ObsidianNoteUpdate) {
  const tokens: Array<{ key: string; html: string }> = [];
  let tokenIndex = 0;

  const stash = (html: string) => {
    const key = `__OBSIDIAN_TOKEN_${tokenIndex}__`;
    tokenIndex += 1;
    tokens.push({ key, html });
    return key;
  };

  let working = text;

  working = working.replace(/```([\s\S]*?)```/g, (_, code) =>
    stash(`<pre class="obsidian-md-codeblock"><code>${escapeHtml(code.trim())}</code></pre>`)
  );

  working = working.replace(/`([^`]+)`/g, (_, code) =>
    stash(`<code class="obsidian-md-inline-code">${escapeHtml(code)}</code>`)
  );

  working = working.replace(/!\[\[([^[\]]+?)\]\]/g, (_, rawTarget) => {
    const { path, width } = cleanWikiTarget(rawTarget);

    if (!IMAGE_FILE_PATTERN.test(path)) {
      return stash(`<span class="obsidian-md-note-link">${escapeHtml(path)}</span>`);
    }

    return stash(renderImageHtml(path, path.split("/").pop() || "image", note, width));
  });

  working = working.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, rawTarget) =>
    stash(renderImageHtml(cleanMarkdownTarget(rawTarget), alt || "image", note))
  );

  working = working.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawTarget) =>
    stash(renderLinkHtml(label, rawTarget, note))
  );

  working = working.replace(/\[\[([^[\]]+?)\]\]/g, (_, target) => stash(renderWikiLinkHtml(target)));

  working = escapeHtml(working);
  working = applyInlineFormatting(working).replace(/\n/g, "<br />");

  for (const token of tokens) {
    working = working.replaceAll(token.key, token.html);
  }

  return working;
}

type MarkdownBlock =
  | { type: "heading"; depth: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; code: string }
  | { type: "hr" };

function parseBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({ type: "code", code: codeLines.join("\n") });
      continue;
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);

    if (headingMatch) {
      blocks.push({
        type: "heading",
        depth: headingMatch[1].length,
        text: headingMatch[2],
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push({ type: "blockquote", text: quoteLines.join("\n") });
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];

      while (
        index < lines.length &&
        (ordered ? /^\s*\d+\.\s+/.test(lines[index]) : /^\s*[-*+]\s+/.test(lines[index]))
      ) {
        items.push(lines[index].replace(ordered ? /^\s*\d+\.\s+/ : /^\s*[-*+]\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^\s*[-*+]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^```/.test(lines[index].trim()) &&
      !/^---+$/.test(lines[index].trim()) &&
      !/^\*\*\*+$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join("\n") });
  }

  return blocks;
}

export function renderObsidianMarkdown(content: string, note: ObsidianNoteUpdate) {
  const blocks = parseBlocks(content);

  return blocks
    .map((block) => {
      if (block.type === "heading") {
        const tag = `h${Math.min(block.depth, 6)}`;

        return `<${tag}>${renderInlineHtml(block.text, note)}</${tag}>`;
      }

      if (block.type === "paragraph") {
        return `<p>${renderInlineHtml(block.text, note)}</p>`;
      }

      if (block.type === "blockquote") {
        return `<blockquote>${renderInlineHtml(block.text, note)}</blockquote>`;
      }

      if (block.type === "code") {
        return `<pre class="obsidian-md-codeblock"><code>${escapeHtml(block.code)}</code></pre>`;
      }

      if (block.type === "hr") {
        return "<hr />";
      }

      const tag = block.ordered ? "ol" : "ul";

      return `<${tag}>${block.items
        .map((item) => `<li>${renderInlineHtml(item, note)}</li>`)
        .join("")}</${tag}>`;
    })
    .join("");
}
