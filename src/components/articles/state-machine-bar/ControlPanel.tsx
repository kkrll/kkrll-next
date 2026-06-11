import type { Content } from "./engine";

const targets: { value: Content | null; label: string }[] = [
  { value: null, label: "closed" },
  { value: "video", label: "video" },
  { value: "animation", label: "animation" },
  { value: "hint", label: "hint" },
];

export default function ControlPanel({
  target,
  naive,
  onTargetChange,
  onNaiveChange,
}: {
  target: Content | null;
  naive: boolean;
  onTargetChange: (t: Content | null) => void;
  onNaiveChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
      <div className="flex items-center gap-1">
        {targets.map((t) => {
          const active = target === t.value;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => onTargetChange(t.value)}
              className={`rounded-md border px-3 py-1.5 transition-colors ${
                active
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <label className="ml-auto flex cursor-pointer select-none items-center gap-2">
        <span className="uppercase tracking-wide text-white/40">naive</span>
        <span
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            naive ? "bg-red-500/80" : "bg-white/15"
          }`}
        >
          <input
            type="checkbox"
            checked={naive}
            onChange={(e) => onNaiveChange(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              naive ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </span>
      </label>
    </div>
  );
}
