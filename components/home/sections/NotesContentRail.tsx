"use client";

import { X } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { extractObsidianHeadings, renderObsidianMarkdown } from "@/lib/obsidian-markdown";
import type { ObsidianNoteUpdate } from "@/lib/obsidian-notes";

type NotesContentRailProps = {
  notes: ObsidianNoteUpdate[];
};

type LaneDefinition = {
  id: string;
  direction: "left" | "right";
  minCards: number;
  speed: number;
  cardClassName: string;
};

type NotesLaneProps = {
  lane: LaneDefinition;
  notes: ObsidianNoteUpdate[];
  onOpen: (note: ObsidianNoteUpdate) => void;
};

const titleFont = '"Iowan Old Style", "Palatino Linotype", "Songti SC", serif';
const monoFont = '"SFMono-Regular", "JetBrains Mono", "Menlo", monospace';

const laneDefinitions: LaneDefinition[] = [
  {
    id: "row-01",
    direction: "right",
    minCards: 9,
    speed: 54,
    cardClassName: "bg-[#fbfcfd]",
  },
  {
    id: "row-02",
    direction: "left",
    minCards: 10,
    speed: 54,
    cardClassName: "bg-[#f9fbfc]",
  },
  {
    id: "row-03",
    direction: "right",
    minCards: 9,
    speed: 54,
    cardClassName: "bg-[#fcfcfb]",
  },
];

const previewClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  overflow: "hidden",
  minHeight: "3.1em",
};

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function buildLoopNotes(notes: ObsidianNoteUpdate[], minimumCards: number) {
  if (notes.length === 0) {
    return [];
  }

  const copies = Math.max(1, Math.ceil(minimumCards / notes.length));
  const items: ObsidianNoteUpdate[] = [];

  for (let copyIndex = 0; copyIndex < copies; copyIndex += 1) {
    items.push(...notes);
  }

  return items;
}

function NoteCard({
  note,
  lane,
  onOpen,
  itemKey,
}: {
  note: ObsidianNoteUpdate;
  lane: LaneDefinition;
  onOpen: (note: ObsidianNoteUpdate) => void;
  itemKey: string;
}) {
  return (
    <button
      key={itemKey}
      type="button"
      onClick={() => onOpen(note)}
      className={`group relative flex h-[194px] w-[296px] shrink-0 flex-col overflow-hidden bg-transparent p-0 text-left shadow-none transition-transform duration-200 hover:-translate-y-0.5 sm:w-[316px] lg:w-[334px] ${lane.cardClassName}`}
      aria-label={`打开笔记 ${note.title}`}
    >
      <div className="pointer-events-none absolute inset-[6px] border border-[#cfd6dd]" />
      <div className="pointer-events-none absolute left-[14px] top-[14px] h-[6px] w-[6px] bg-[#a8b0b8]" />
      <div className="pointer-events-none absolute right-[14px] top-[14px] h-[6px] w-[6px] bg-[#a8b0b8]" />
      <div className="pointer-events-none absolute bottom-[14px] left-[14px] h-[6px] w-[6px] bg-[#a8b0b8]" />
      <div className="pointer-events-none absolute bottom-[14px] right-[14px] h-[6px] w-[6px] bg-[#a8b0b8]" />

      <div className="relative z-10 flex h-full flex-col px-7 py-5">
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#8b98a7]">
        <span>{note.changeType === "new" ? "new" : "updated"}</span>
        <time>{formatNoteDate(note.updatedAt)}</time>
        </div>

        <h3
          className="mt-2 mb-0 text-[1.28rem] leading-[1.02] tracking-[-0.04em] text-[#111827]"
          style={{ fontFamily: titleFont }}
        >
          {note.title}
        </h3>

        <p
          className="mt-1 mb-0 truncate text-[11px] leading-5 text-[#6b7280]"
          style={{ fontFamily: monoFont }}
          title={note.repoPath}
        >
          {note.repoPath}
        </p>

        <div className="mt-2 flex min-h-0 flex-1 border-t border-[#e4ebf1] pt-2">
          <p className="m-0 text-[13px] leading-[1.55] text-[#374151] sm:text-[14px]" style={previewClampStyle}>
            {note.previewText || note.content || note.excerpt || "这篇笔记目前没有可展示的正文内容。"}
          </p>
        </div>
      </div>
    </button>
  );
}

function NotesLane({ lane, notes, onOpen }: NotesLaneProps) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(48);
  const laneNotes = buildLoopNotes(notes, lane.minCards);

  useEffect(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const updateDuration = () => {
      const width = group.getBoundingClientRect().width;

      if (width > 0) {
        setDuration(width / lane.speed);
      }
    };

    updateDuration();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateDuration);
    observer.observe(group);

    return () => {
      observer.disconnect();
    };
  }, [lane.speed, laneNotes.length]);

  const trackStyle = {
    "--lane-gap": "0.5rem",
    animationDuration: `${duration}s`,
  } as CSSProperties;

  return (
    <div className="notes-kinetic-mask notes-marquee--pause overflow-hidden py-2 -my-2">
      <div
        className={`notes-marquee__track ${
          lane.direction === "left" ? "notes-marquee__track--left" : "notes-marquee__track--right"
        }`}
        style={trackStyle}
      >
        <div ref={groupRef} className="notes-marquee__group">
          {laneNotes.map((note, index) => (
            <NoteCard
              key={`${lane.id}-primary-${note.id}-${index}`}
              note={note}
              lane={lane}
              onOpen={onOpen}
              itemKey={`${lane.id}-primary-${note.id}-${index}`}
            />
          ))}
        </div>
        <div className="notes-marquee__group">
          {laneNotes.map((note, index) => (
            <NoteCard
              key={`${lane.id}-clone-${note.id}-${index}`}
              note={note}
              lane={lane}
              onOpen={onOpen}
              itemKey={`${lane.id}-clone-${note.id}-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type NoteDialogProps = {
  note: ObsidianNoteUpdate;
  headings: Array<{ id: string; depth: number; text: string }>;
  onJumpToHeading: (id: string) => void;
  onContentScrollReady: (element: HTMLDivElement | null) => void;
  onClose: () => void;
};

function NoteDialog({ note, headings, onJumpToHeading, onContentScrollReady, onClose }: NoteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#09111f]/56 p-4 backdrop-blur-md md:p-6"
      onClick={onClose}
    >
      <div className="relative mx-auto flex h-full max-w-[1280px] items-center justify-center">
        <div
          className="relative flex h-[min(82vh,860px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-[18px] bg-[#fbfcfd] shadow-[0_28px_120px_rgba(6,19,34,0.22)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-[12px] border border-[#ccd4dc]" />
          <div className="pointer-events-none absolute left-[18px] top-[18px] h-[7px] w-[7px] bg-[#a7b0b8]" />
          <div className="pointer-events-none absolute right-[18px] top-[18px] h-[7px] w-[7px] bg-[#a7b0b8]" />
          <div className="pointer-events-none absolute bottom-[18px] left-[18px] h-[7px] w-[7px] bg-[#a7b0b8]" />
          <div className="pointer-events-none absolute bottom-[18px] right-[18px] h-[7px] w-[7px] bg-[#a7b0b8]" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="absolute right-6 top-6 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7dee5] bg-white/92 text-[#5f7183] transition-colors duration-200 hover:border-[#b9c5d0] hover:text-[#111827]"
            aria-label="Close note"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-10 pb-10 pt-9 md:px-12 md:pb-12 md:pt-10">
            <div className="flex items-start justify-between gap-8 border-b border-[#e2e8ee] pb-6 pr-12">
              <div className="min-w-0">
                <p
                  className="m-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8c99a7]"
                  style={{ fontFamily: monoFont }}
                >
                  Obsidian / Full Note
                </p>

                <h3
                  className="mt-4 text-[clamp(2.4rem,4vw,4.2rem)] leading-[0.92] tracking-[-0.06em] text-[#111827]"
                  style={{ fontFamily: titleFont }}
                >
                  {note.title}
                </h3>
              </div>

              <div
                className="hidden shrink-0 gap-6 text-right md:grid md:grid-cols-2"
                style={{ fontFamily: monoFont }}
              >
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8c99a7]">
                    {note.changeType === "new" ? "NEW" : "UPDATED"}
                  </p>
                  <p className="mt-2 mb-0 text-[12px] leading-6 text-[#1f2937]">
                    {formatNoteDate(note.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8c99a7]">
                    COMMIT
                  </p>
                  <p className="mt-2 mb-0 text-[12px] leading-6 text-[#1f2937]">{note.sha.slice(0, 7)}</p>
                </div>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="overflow-y-auto border-b border-[#e2e8ee] py-6 lg:border-b-0 lg:border-r lg:pr-8">
                <div className="space-y-6">
                  <div>
                    <p
                      className="m-0 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8c99a7]"
                      style={{ fontFamily: monoFont }}
                    >
                      Path
                    </p>
                    <p
                      className="mt-2 mb-0 text-[12px] leading-6 text-[#5f6f80] break-all"
                      style={{ fontFamily: monoFont }}
                    >
                      {note.repoPath}
                    </p>
                  </div>

                  <div>
                    <p
                      className="m-0 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8c99a7]"
                      style={{ fontFamily: monoFont }}
                    >
                      Message
                    </p>
                    <p className="mt-2 mb-0 text-sm leading-7 text-[#52606f]">{note.commitMessage}</p>
                  </div>

                  <div className="border-t border-[#e2e8ee] pt-6">
                    <p
                      className="m-0 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8c99a7]"
                      style={{ fontFamily: monoFont }}
                    >
                      Outline
                    </p>

                    {headings.length > 0 ? (
                      <div className="mt-3 space-y-1">
                        {headings.map((heading) => (
                          <button
                            key={heading.id}
                            type="button"
                            onClick={() => onJumpToHeading(heading.id)}
                            className="block w-full cursor-pointer rounded-[6px] px-2 py-1 text-left leading-6 text-[#334155] transition-colors hover:bg-[#eef3f7] hover:text-[#111827]"
                            style={{
                              paddingLeft: `${8 + Math.max(0, heading.depth - 1) * 18}px`,
                              fontSize: heading.depth <= 1 ? "13px" : heading.depth === 2 ? "12.5px" : "12px",
                              opacity: heading.depth <= 1 ? 1 : heading.depth === 2 ? 0.9 : 0.8,
                            }}
                          >
                            {heading.text}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 mb-0 text-sm leading-6 text-[#8c99a7]">No headings</p>
                    )}
                  </div>
                </div>
              </aside>

              <div className="min-h-0 pt-7 lg:pl-10">
                <div className="h-full overflow-y-auto pr-1" ref={onContentScrollReady}>
                  <article
                    className="obsidian-markdown obsidian-markdown--dense"
                    dangerouslySetInnerHTML={{
                      __html: renderObsidianMarkdown(
                        note.content || "这篇笔记目前没有可展示的正文内容。",
                        note
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotesContentRail({ notes }: NotesContentRailProps) {
  const [activeNote, setActiveNote] = useState<ObsidianNoteUpdate | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const headings = useMemo(
    () => (activeNote ? extractObsidianHeadings(activeNote.content || "") : []),
    [activeNote]
  );

  useEffect(() => {
    if (!activeNote) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveNote(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeNote]);

  const handleClose = () => {
    setActiveNote(null);
    contentScrollRef.current = null;
  };

  const handleJumpToHeading = (id: string) => {
    const container = contentScrollRef.current;

    if (!container) {
      return;
    }

    const target = container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="space-y-1">
        {laneDefinitions.map((lane) => (
          <div key={lane.id}>
            <NotesLane lane={lane} notes={notes} onOpen={setActiveNote} />
          </div>
        ))}
      </div>

      {activeNote ? (
        <NoteDialog
          note={activeNote}
          headings={headings}
          onJumpToHeading={handleJumpToHeading}
          onContentScrollReady={(element) => {
            contentScrollRef.current = element;
          }}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
