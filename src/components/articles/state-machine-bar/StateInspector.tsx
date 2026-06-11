import type { Content, State } from "./engine";

const nodes: State["kind"][] = ["closed", "opening", "open", "closing"];

export default function StateInspector({
  state,
  target,
  naive,
}: {
  state: State;
  target: Content | null;
  naive: boolean;
}) {
  return (
    <div className="mt-4 rounded-xl border border-foreground-05 bg-background-07/40 p-3 font-mono text-xs">
      <div className="mb-3 flex items-center gap-1">
        {nodes.map((node, i) => (
          <div key={node} className="flex items-center gap-1">
            <span
              className={`rounded-md px-2 py-1 uppercase tracking-wide transition-colors ${
                state.kind === node
                  ? "bg-foreground text-background"
                  : "bg-background-05 text-foreground-07"
              }`}
            >
              {node}
            </span>
            {i < nodes.length - 1 && (
              <span className="text-foreground-07">→</span>
            )}
          </div>
        ))}
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap break-words leading-relaxed text-foreground-07">
        {`state  = ${formatState(state)}\n`}
        {`target = ${target ?? "null"}\n`}
        {`naive  = ${naive}`}
      </pre>
    </div>
  );
}

function formatState(state: State): string {
  switch (state.kind) {
    case "closed":
      return `{ kind: "closed" }`;
    case "opening":
      return `{ kind: "opening", content: "${state.content}" }`;
    case "open":
      return `{ kind: "open", content: "${state.content}" }`;
    case "closing":
      return state.next
        ? `{ kind: "closing", from: "${state.from}", next: "${state.next}" }`
        : `{ kind: "closing", from: "${state.from}" }`;
  }
}
