"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { renderObsidianMarkdown } from "@/lib/obsidian-markdown";
import type { ObsidianNoteUpdate } from "@/lib/obsidian-notes";

type NotesContentRailProps = {
  notes: ObsidianNoteUpdate[];
};

const changeTypeStyles = {
  new: "border-emerald-400/45 bg-emerald-500/10 text-emerald-700",
  updated: "border-sky-400/45 bg-sky-500/10 text-sky-700",
} as const;

const changeTypeLabels = {
  new: "NEW",
  updated: "UPDATED",
} as const;

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export function NotesContentRail({ notes }: NotesContentRailProps) {
  const [activeNote, setActiveNote] = useState<ObsidianNoteUpdate | null>(null);

  useEffect(() => {
    if (!activeNote) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveNote(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeNote]);

  return (
    <>
      <div className="mt-12 flex gap-5 overflow-x-auto pb-4">
        {notes.map((note) => (
          <article
            key={note.id}
            className="w-[340px] shrink-0 rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,250,255,0.92)_100%)] shadow-[0_28px_90px_rgba(16,39,70,0.12)]"
          >
            <button
              type="button"
              onClick={() => setActiveNote(note)}
              className="flex min-h-[460px] w-full flex-col rounded-[30px] p-6 text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.22em] ${changeTypeStyles[note.changeType]}`}
                >
                  {changeTypeLabels[note.changeType]}
                </span>
                <time className="text-right text-xs leading-5 text-[#6b8198]">
                  {formatNoteDate(note.updatedAt)}
                </time>
              </div>

              <h3 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#09111f]">
                {note.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5b7087]">{note.path}</p>

              <div className="mt-8 rounded-[24px] border border-[#d8e4ef] bg-[#f8fbff] px-4 py-4">
                <p className="m-0 text-sm leading-7 text-[#2a3b4d]">
                  {note.excerpt || "这篇笔记目前没有可展示的正文内容。"}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <p className="rounded-[22px] border border-[#d8e4ef] bg-white/70 px-4 py-3 text-xs leading-6 text-[#61768c]">
                  {note.commitMessage}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#dde7f0] pt-5 text-xs uppercase tracking-[0.2em] text-[#6b8198]">
                <span>{note.sha.slice(0, 7)}</span>
                <span>{note.changeType === "new" ? "查看正文" : "展开全文"}</span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {activeNote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09111f]/45 p-4 backdrop-blur-sm">
          <div className="relative max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,249,255,0.96)_100%)] shadow-[0_30px_120px_rgba(9,17,31,0.28)]">
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8e4ef] bg-white text-[#415569]"
              aria-label="Close note"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#dde7f0] px-7 py-7 md:px-10">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#6b8198]">
                <span
                  className={`rounded-full border px-3 py-1 font-semibold ${changeTypeStyles[activeNote.changeType]}`}
                >
                  {changeTypeLabels[activeNote.changeType]}
                </span>
                <span>{formatNoteDate(activeNote.updatedAt)}</span>
                <span>{activeNote.sha.slice(0, 7)}</span>
              </div>

              <h3 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[#09111f]">
                {activeNote.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#5b7087]">{activeNote.path}</p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-7 py-7 md:px-10">
              <article
                className="obsidian-markdown"
                dangerouslySetInnerHTML={{
                  __html: renderObsidianMarkdown(
                    activeNote.content || "这篇笔记目前没有可展示的正文内容。",
                    activeNote
                  ),
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
