import { DURATION_MS, type State, isOpen, visibleContent } from "./engine";

const labels = {
  video: "Video controls",
  animation: "Animation params",
  hint: "Pick a thing to preview",
} as const;

const tints = {
  video: "bg-blue-500/15 text-blue-300 border-blue-400/40",
  animation: "bg-amber-500/15 text-amber-300 border-amber-400/40",
  hint: "bg-zinc-500/15 text-zinc-300 border-zinc-400/40",
} as const;

export default function SimplifiedBar({ state }: { state: State }) {
  const content = visibleContent(state);
  const open = isOpen(state);

  return (
    <div className="flex items-center gap-2">
      <div
        className="overflow-hidden"
        style={{
          maxWidth: open ? "280px" : "0px",
          transition: `max-width ${DURATION_MS}ms ease-out`,
        }}
      >
        <div
          className={`flex h-10 min-w-[260px] items-center rounded-xl border px-4 text-sm font-mono ${
            content ? tints[content] : "border-transparent"
          }`}
          style={{
            opacity: open ? 1 : 0,
            transition: `opacity ${DURATION_MS}ms ease-out`,
          }}
        >
          {content ? labels[content] : " "}
        </div>
      </div>

      <button
        type="button"
        disabled
        aria-label="Anchor button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/60"
      >
        <span className="block h-2 w-2 rounded-full bg-current" />
      </button>
    </div>
  );
}
