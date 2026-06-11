"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Content,
  DURATION_MS,
  type State,
  isTransitioning,
  step,
} from "./engine";
import SimplifiedBar from "./SimplifiedBar";
import RealBar from "./RealBar";
import StateInspector from "./StateInspector";
import ControlPanel from "./ControlPanel";

type Variant = "simplified" | "real";

export default function StateMachineDemo({
  variant: initialVariant = "simplified",
  showInspector = false,
}: {
  variant?: Variant;
  showInspector?: boolean;
}) {
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [target, setTarget] = useState<Content | null>(null);
  const [naive, setNaive] = useState(false);
  const [state, setState] = useState<State>({ kind: "closed" });

  const targetRef = useRef(target);
  const naiveRef = useRef(naive);
  useEffect(() => {
    targetRef.current = target;
    naiveRef.current = naive;
  });

  useEffect(() => {
    setState((s) => step(s, target, "target", naive));
  }, [target, naive]);

  useEffect(() => {
    if (!isTransitioning(state)) return;
    const id = window.setTimeout(() => {
      setState((s) => step(s, targetRef.current, "timer", naiveRef.current));
    }, DURATION_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  const Bar = variant === "real" ? RealBar : SimplifiedBar;

  return (
    <div className="not-prose my-8 rounded-2xl bg-black p-6 font-sans text-white w-full">
      <div className="mb-4 flex justify-end">
        <VariantToggle variant={variant} onChange={setVariant} />
      </div>

      <div className="mb-6 flex min-h-[80px] items-center justify-end ">
        <Bar state={state} />
      </div>

      <ControlPanel
        target={target}
        naive={naive}
        onTargetChange={setTarget}
        onNaiveChange={setNaive}
      />

      {showInspector && (
        <div className="mt-4">
          <StateInspector state={state} target={target} naive={naive} />
        </div>
      )}
    </div>
  );
}

function VariantToggle({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
}) {
  const opts: Variant[] = ["simplified", "real"];
  return (
    <div className="inline-flex rounded-md border border-white/15 p-0.5 text-xs font-mono">
      {opts.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded px-2.5 py-1 transition-colors ${variant === v
            ? "bg-white/15 text-white"
            : "text-white/50 hover:text-white"
            }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
