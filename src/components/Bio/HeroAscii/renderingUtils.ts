import { CHAR_WIDTH, CHAR_HEIGHT } from "./constants";
import type { CharCell } from "./types";

export interface RenderSettings {
  style: "Ascii" | "Dot";
  invert: boolean;
  // TODO: cellSize, colorMode
}

export function mapLevel(level: number, maxLevel: number, invert: boolean) {
  return invert ? maxLevel - level : level;
}

function renderDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
) {
  const radius = level / 1.66;
  const centerX = x + CHAR_WIDTH / 2;
  const centerY = y + CHAR_HEIGHT / 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function renderChar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  char: string
) {
  ctx.fillText(char || "", x, y);
}

export function renderCell(
  ctx: CanvasRenderingContext2D,
  cell: CharCell,
  settings: RenderSettings,
  x: number,
  y: number,
  chars: string[]
): void {
  // Transparent pixels don't render anything (show background)
  if (cell.isTransparent) {
    return;
  }

  // Opaque pixels get inverted via mapLevel
  const level = mapLevel(cell.currentLevel, chars.length - 1, settings.invert);

  if (settings.style === "Dot") {
    renderDot(ctx, x, y, level);
  } else {
    renderChar(ctx, x, y, chars[level]);
  }
}
