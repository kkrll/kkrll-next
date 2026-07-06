export interface SourceChar {
  char: string;
  x: number;
  y: number;
  /** advance width, used to align flight paths on glyph centers */
  w: number;
  /** rendered line box height, used to center flight paths vertically */
  h: number;
  /** computed font-size, used to scale the flying glyph 1:1 at takeoff */
  fs: number;
}

/**
 * Measure the viewport position of every visible character inside `root`
 * via the Range API — no DOM changes, so the markup crawlers and screen
 * readers see stays untouched.
 */
export function measureHeroChars(root: HTMLElement): SourceChar[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const chars: SourceChar[] = [];

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent) continue;
    // [data-keep] marks text that stays in place instead of flying
    if (parent.closest("[data-keep]")) continue;
    const style = window.getComputedStyle(parent);
    if (style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    const fontSize = Number.parseFloat(style.fontSize);

    const text = node.textContent ?? "";
    for (let i = 0; i < text.length; i++) {
      if (text[i].trim() === "") continue;
      range.setStart(node as Text, i);
      range.setEnd(node as Text, i + 1);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0) continue;
      chars.push({
        char: text[i],
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        fs: fontSize,
      });
    }
  }

  return chars;
}
