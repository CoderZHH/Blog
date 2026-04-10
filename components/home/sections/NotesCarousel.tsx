import { getLatestObsidianNotes } from "@/lib/obsidian-notes";
import { NotesContentRail } from "./NotesContentRail";

type NotesStatePanelProps = {
  title: string;
  description: string;
  tone: "neutral" | "error";
};

const statePanelStyles = {
  neutral: {
    shell:
      "border-white/75 bg-white/70 text-[#09111f] shadow-[0_24px_90px_rgba(17,40,74,0.08)]",
    body: "text-[#4f657d]",
  },
  error: {
    shell:
      "border-[#f0c7cb] bg-[#fff5f6] text-[#6f1f2e] shadow-[0_24px_90px_rgba(126,30,49,0.08)]",
    body: "text-[#8f5560]",
  },
} as const;

function NotesStatePanel({ title, description, tone }: NotesStatePanelProps) {
  const styles = statePanelStyles[tone];

  return (
    <div
      className={`mt-12 rounded-[34px] border p-8 md:p-10 ${styles.shell}`}
    >
      <h3 className="m-0 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
      <p className={`mt-4 max-w-3xl text-sm leading-7 md:text-base ${styles.body}`}>{description}</p>
    </div>
  );
}

export async function NotesCarousel() {
  const { configured, error, notes } = await getLatestObsidianNotes();

  return (
    <section id="lab" className="bg-white text-[#09111f]">
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-2 pb-6 md:px-6 md:pt-1 md:pb-8 lg:px-8 lg:pt-0 lg:pb-10">
        {!configured ? (
          <NotesStatePanel
            tone="neutral"
            title="等待配置 GitHub 私有仓库读取权限"
            description="需要在环境变量里配置 `GITHUB_NOTES_TOKEN`，博客服务端才能读取 `CoderZHH/ObsdianNote` 私有仓库中 `开发/` 目录下的笔记更新。"
          />
        ) : error ? (
          <NotesStatePanel tone="error" title="Obsidian 同步暂时失败" description={error} />
        ) : notes.length === 0 ? (
          <NotesStatePanel
            tone="neutral"
            title="暂时还没有可展示的笔记更新"
            description="当前没有读取到 `开发/` 目录下最近的 Markdown 更新。下一次 push 之后，这里会自动变成三轨流动的笔记墙。"
          />
        ) : (
          <NotesContentRail notes={notes} />
        )}
      </div>
    </section>
  );
}
