export type Content = "video" | "animation" | "hint";

export type State =
  | { kind: "closed" }
  | { kind: "opening"; content: Content }
  | { kind: "open"; content: Content }
  | { kind: "closing"; from: Content; next?: Content };

export const DURATION_MS = 300;

export type Trigger = "timer" | "target";

export function step(
  state: State,
  target: Content | null,
  trigger: Trigger,
  naive: boolean,
): State {
  if (trigger === "timer") {
    if (state.kind === "opening") return { kind: "open", content: state.content };
    if (state.kind === "closing") {
      return state.next
        ? { kind: "opening", content: state.next }
        : { kind: "closed" };
    }
    return state;
  }

  if (state.kind === "opening" || state.kind === "closing") return state;

  if (state.kind === "closed") {
    return target ? { kind: "opening", content: target } : state;
  }

  if (target === null) return { kind: "closing", from: state.content };
  if (target === state.content) return state;
  return naive
    ? { kind: "open", content: target }
    : { kind: "closing", from: state.content, next: target };
}

export function isTransitioning(state: State): boolean {
  return state.kind === "opening" || state.kind === "closing";
}

export function visibleContent(state: State): Content | null {
  if (state.kind === "closed") return null;
  if (state.kind === "closing") return state.from;
  return state.content;
}

export function isOpen(state: State): boolean {
  return state.kind === "open" || state.kind === "opening";
}
