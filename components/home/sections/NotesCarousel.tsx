export function NotesCarousel() {
  const notes = new Array(5).fill("Obsidian new node");

  return (
    <section id="lab" className="min-h-screen overflow-hidden">
      <div className="flex min-h-screen items-center gap-4 overflow-x-auto">
          {notes.map((note, index) => (
            <article
              key={`${note}-${index}`}
              className="flex h-80 w-56 shrink-0 items-center justify-center text-center text-2xl font-medium text-white"
            >
              {note}
            </article>
          ))}
      </div>
    </section>
  );
}
