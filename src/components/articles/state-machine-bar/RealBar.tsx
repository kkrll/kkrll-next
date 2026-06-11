import { ReactNode, useState } from "react";
import { DURATION_MS, type State, isOpen, visibleContent } from "./engine";
import { PlayIcon, RestoreIcon, TrimIcon } from "@/components/ui/icons";

export default function RealBar({ state }: { state: State }) {
  const content = visibleContent(state);
  const open = isOpen(state);
  const playMode = open && (content === "video" || content === "animation");
  const uploadMode = open && content === "hint";

  const [trimming, setTrimming] = useState(false);
  const [loop, setLoop] = useState(true);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
      <div className="flex items-center justify-end">
        <div
          className="overflow-hidden"
          style={{
            maxWidth: open ? "540px" : "0px",
            transition: `max-width ${DURATION_MS}ms ease-out`,
          }}
        >
          <div
            className="flex min-w-max items-center gap-2 pr-3"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity ${DURATION_MS}ms ease-out`,
            }}
          >
            {content === "video" && (
              <VideoPanel
                trimming={trimming}
                onTrimmingChange={setTrimming}
                loop={loop}
                onLoopChange={setLoop}
              />
            )}
            {content === "animation" && <AnimationPanel />}
            {content === "hint" && <HintPanel />}
          </div>
        </div>

        <button
          type="button"
          className={`flex h-8 min-w-28 items-center justify-center rounded-xl px-3 text-xs font-mono uppercase transition-colors ${playMode
            ? "bg-foreground text-background"
            : uploadMode
              ? "bg-transparent text-background hover:bg-foreground/10"
              : "bg-transparent text-foreground/50 hover:text-foreground"
            }`}
        >
          {playMode ? <>play <PlayIcon /></> : uploadMode ? "↑ upload" : <>play <PlayIcon /></>}
        </button>
      </div>
    </div>
  );
}

const TRIM_START_PCT = 8;
const TRIM_END_PCT = 72;
const CURRENT_PCT = 33;
const FAKE_DURATION = 36;

function VideoPanel({
  trimming,
  onTrimmingChange,
  loop,
  onLoopChange,
}: {
  trimming: boolean;
  onTrimmingChange: (v: boolean) => void;
  loop: boolean;
  onLoopChange: (v: boolean) => void;
}) {
  const trimStart = (TRIM_START_PCT / 100) * FAKE_DURATION;
  const trimEnd = (TRIM_END_PCT / 100) * FAKE_DURATION;
  const current = (CURRENT_PCT / 100) * FAKE_DURATION;

  return (
    <>
      <Chip label="Anim" />
      <Chip label={<RestoreIcon size={20} />} active={loop} onClick={() => onLoopChange(!loop)} />
      <Chip
        label={<><TrimIcon size={20} /></>}
        active={trimming}
        onClick={() => onTrimmingChange(!trimming)}
      />

      <div className="mx-1 h-6 w-px bg-white/15" />

      <span
        className={`shrink-0 overflow-hidden whitespace-nowrap font-mono text-xs tabular-nums text-white/60 transition-[opacity,max-width] duration-150 ${trimming ? "max-w-16 animate-pulse italic opacity-100" : "max-w-0 opacity-0"
          }`}
      >
        {fmtTime(trimStart)}
      </span>

      <Timeline trimming={trimming} />

      <span className="flex shrink-0 items-center font-mono text-xs tabular-nums text-white/60">
        <span
          className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width,margin] duration-150 ${trimming ? "mr-0 max-w-0 opacity-0" : "mr-1.5 max-w-20 opacity-100"
            }`}
        >
          {fmtTime(current - trimStart)} /{" "}
        </span>
        <span
          className={`whitespace-nowrap ${trimming ? "animate-pulse italic" : ""}`}
        >
          {fmtTime(trimEnd - trimStart)}
        </span>
      </span>
    </>
  );
}

function Timeline({ trimming }: { trimming: boolean }) {
  return (
    <div className="relative h-6 w-32 shrink-0">
      {trimming ? (
        <>
          <div className="absolute inset-y-2 inset-x-0 rounded-full bg-white/5" />
          <div
            className="absolute inset-y-2 rounded-sm bg-white/20"
            style={{
              left: `${TRIM_START_PCT}%`,
              right: `${100 - TRIM_END_PCT}%`,
            }}
          />
          <Handle pct={TRIM_START_PCT} />
          <Handle pct={TRIM_END_PCT} />
        </>
      ) : (
        <>
          <div className="absolute inset-y-[10px] inset-x-0 rounded-full bg-white/10" />
          <div
            className="absolute inset-y-[10px] left-0 rounded-full bg-white/60"
            style={{ width: `${CURRENT_PCT}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white"
            style={{ left: `${CURRENT_PCT}%` }}
          />
        </>
      )}
    </div>
  );
}

function Handle({ pct }: { pct: number }) {
  return (
    <div
      className="absolute inset-y-0 flex w-3 -translate-x-1/2 items-center justify-center"
      style={{ left: `${pct}%` }}
    >
      <div className="h-full w-1 rounded-sm bg-white" />
    </div>
  );
}

function AnimationPanel() {
  return (
    <span className="px-3 font-mono text-xs uppercase text-white/60">
      3 animated params
    </span>
  );
}

function HintPanel() {
  return (
    <span className="whitespace-nowrap px-3 font-mono text-xs text-white/60">
      Upload a video or enable animation
    </span>
  );
}

function Chip({
  label,
  active = false,
  onClick,
}: {
  label: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex h-8 items-center rounded-xl border px-3 text-xs font-mono uppercase transition-colors ${active
        ? "border-transparent bg-white/85 text-black"
        : "border-white/15 text-white/60 hover:text-white"
        }`}
    >
      {label}
    </Tag>
  );
}

function fmtTime(s: number) {
  const safe = Number.isFinite(s) && s > 0 ? s : 0;
  const m = Math.floor(safe / 60);
  const sec = Math.floor(safe % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
