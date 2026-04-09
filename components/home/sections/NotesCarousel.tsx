import { getLatestObsidianNotes } from "@/lib/obsidian-notes";
import { NotesContentRail } from "./NotesContentRail";

export async function NotesCarousel() {
  const { configured, error, notes, sourceLabel } = await getLatestObsidianNotes();

  return (
    <section id="lab" className="relative overflow-hidden bg-white text-[#09111f]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col justify-center px-6 py-20 md:px-10 lg:px-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.52em] text-[#53718e]">
              Obsidian
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[#09111f] md:text-6xl">
              最近同步的 10 条笔记
            </h2>
          </div>

          {sourceLabel ? (
            <div className="w-fit rounded-full border border-[#c8d8ea] bg-white/80 px-4 py-2 text-xs text-[#53718e] shadow-[0_18px_50px_rgba(17,40,74,0.08)]">
              {sourceLabel}
            </div>
          ) : null}
        </div>

        {!configured ? (
          <div className="mt-12 rounded-[30px] border border-dashed border-[#bfd1e2] bg-white/76 p-8 shadow-[0_24px_80px_rgba(17,40,74,0.08)]">
            <h3 className="m-0 text-2xl font-semibold tracking-[-0.04em] text-[#09111f]">
              等待配置 GitHub 私有仓库读取权限
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#53718e] md:text-base">
              需要在环境变量里配置 `GITHUB_NOTES_TOKEN`，博客服务端才能读取
              `CoderZHH/ObsdianNote` 私有仓库中 `开发/` 目录下的笔记更新。
            </p>
          </div>
        ) : error ? (
          <div className="mt-12 rounded-[30px] border border-[#f0c2c2] bg-[#fff7f7] p-8 shadow-[0_24px_80px_rgba(120,37,37,0.08)]">
            <h3 className="m-0 text-2xl font-semibold tracking-[-0.04em] text-[#6b1b1b]">
              Obsidian 同步暂时失败
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8e4d4d] md:text-base">
              {error}
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="mt-12 rounded-[30px] border border-[#c8d8ea] bg-white/76 p-8 shadow-[0_24px_80px_rgba(17,40,74,0.08)]">
            <h3 className="m-0 text-2xl font-semibold tracking-[-0.04em] text-[#09111f]">
              暂时还没有可展示的笔记更新
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#53718e] md:text-base">
              当前没有读取到 `开发/` 目录下最近的 Markdown 更新。下一次 push 之后这里会显示最新记录。
            </p>
          </div>
        ) : (
          <NotesContentRail notes={notes} />
        )}
      </div>
    </section>
  );
}
