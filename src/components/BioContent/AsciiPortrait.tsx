"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import type { SourceChar } from "./measureHeroChars";
import portraitLevels from "./portraitLevels";

// Density ramp based on draw-kkrll's IMAGE_ASCII_CHARS; the wide dense glyphs
// (※ % @ W) are swapped for narrow ones that fit the 0.6em cell in Geist Sans.
const RAMP = [" ", "·", "-", ":", "+", "i", "s", "x", "$", "8", "K", "N"];

const CHAR_WIDTH_EM = 0.6;
const LINE_HEIGHT_EM = 1.2;
const GLYPH_SCALE = 0.9;

const FLY_MS = 700;
const MAX_STAGGER_MS = 200;

function parsePortrait(raw: string) {
  const [header, art] = raw.split("\n---\n");
  const levels = Number(/levels: (\d+)/.exec(header)?.[1] ?? RAMP.length);
  const rows = art.trim().split("\n");
  return { levels, rows, cols: rows[0].length };
}

const portrait = parsePortrait(portraitLevels);

interface LevelCell {
  row: number;
  col: number;
  level: number;
}

const baseCells: LevelCell[] = [];
portrait.rows.forEach((line, row) => {
  Array.from(line).forEach((ch, col) => {
    if (ch !== ".")
      baseCells.push({ row, col, level: Number.parseInt(ch, 36) });
  });
});

interface Cell {
  row: number;
  col: number;
  glyph: string;
  level: number;
}

interface Flight {
  char: string;
  row: number;
  col: number;
  /**
   * source geometry (viewport px): the span renders here untransformed, so
   * the swap with the hero text is pixel-identical. The FLIP's transform
   * imprecision lives at the landing end, where nothing static sits nearby.
   */
  x: number;
  y: number;
  w: number;
  h: number;
  fs: number;
  /** offset from the source center to the landing cell center */
  dx: number;
  dy: number;
  scale: number;
  delay: number;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface AsciiPortraitProps {
  sourceChars: SourceChar[];
  onCloseStart: () => void;
  onClose: () => void;
}

export default function AsciiPortrait({
  sourceChars,
  onCloseStart,
  onClose,
}: AsciiPortraitProps) {
  const theme = useThemeStore((state) => state.theme);
  const invert = theme === "light";

  const gridRef = useRef<HTMLDivElement>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  // parting = caption fading out, everything else still in place
  const [phase, setPhase] = useState<"gather" | "fly" | "parting" | "return">(
    "gather",
  );

  const visibleCells = useMemo(() => {
    const max = portrait.levels - 1;
    const cells: Cell[] = [];
    for (const c of baseCells) {
      const glyph = RAMP[invert ? max - c.level : c.level] ?? " ";
      if (glyph !== " ")
        cells.push({ row: c.row, col: c.col, glyph, level: c.level });
    }
    return cells;
  }, [invert]);

  // FLIP: measure the rendered grid, assign each hero char a target cell
  // (same glyph when available). Each char renders untransformed at its
  // source and flies by transforming toward the cell.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once at mount by design
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (
      !grid ||
      sourceChars.length === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPhase("fly");
      return;
    }

    const rect = grid.getBoundingClientRect();
    const cellW = rect.width / portrait.cols;
    const cellH = rect.height / portrait.rows.length;
    const cellFontPx = cellH / LINE_HEIGHT_EM;

    const pool = shuffle([...visibleCells]);
    const byGlyph = new Map<string, Cell[]>();
    for (const cell of pool) {
      const list = byGlyph.get(cell.glyph);
      if (list) list.push(cell);
      else byGlyph.set(cell.glyph, [cell]);
    }

    const taken = new Set<Cell>();
    let poolIdx = 0;
    const takeAny = () => {
      while (poolIdx < pool.length && taken.has(pool[poolIdx])) poolIdx++;
      return pool[poolIdx++];
    };
    const takeMatching = (glyph: string) => {
      const list = byGlyph.get(glyph);
      while (list && list.length > 0) {
        const cell = list.pop();
        if (cell && !taken.has(cell)) return cell;
      }
      return undefined;
    };

    const next: Flight[] = [];
    for (const s of sourceChars) {
      const cell = takeMatching(s.char) ?? takeAny();
      if (!cell) break;
      taken.add(cell);
      const cx = rect.left + cell.col * cellW + cellW / 2;
      const cy = rect.top + cell.row * cellH + cellH / 2;
      next.push({
        char: s.char,
        row: cell.row,
        col: cell.col,
        x: s.x,
        y: s.y,
        w: s.w,
        h: s.h,
        fs: s.fs,
        // center-to-center so proportional glyph metrics don't skew the path
        dx: cx - (s.x + s.w / 2),
        dy: cy - (s.y + s.h / 2),
        // shrink from hero size down to the grid's reduced glyph size
        scale: (cellFontPx * GLYPH_SCALE) / s.fs,
        delay: 0,
      });
    }

    // Stagger by flight distance: near chars land first, far ones stream in
    const maxDist = Math.max(...next.map((f) => Math.hypot(f.dx, f.dy)), 1);
    for (const f of next) {
      f.delay = (Math.hypot(f.dx, f.dy) / maxDist) * MAX_STAGGER_MS;
    }
    setFlights(next);

    // double rAF: let the gather state paint before transitioning
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase("fly"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Landed letters stay, so their cells stay empty in the grid underneath
  const holes = useMemo(
    () => new Set(flights.map((f) => f.row * portrait.cols + f.col)),
    [flights],
  );

  // Close sequence: caption fades (parting) -> letters fly home (return) -> unmount
  const handleClose = () => {
    if (phase === "parting" || phase === "return") return;
    if (flights.length === 0) {
      onClose();
      return;
    }
    onCloseStart();
    setPhase("parting");
  };

  useEffect(() => {
    if (phase === "parting") {
      const timer = setTimeout(() => setPhase("return"), 0);
      return () => clearTimeout(timer);
    }
    if (phase === "return") {
      const timer = setTimeout(onClose, FLY_MS + MAX_STAGGER_MS + 100);
      return () => clearTimeout(timer);
    }
  }, [phase, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    const handleScrollIntent = (e: Event) => {
      e.preventDefault();
      handleClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleScrollIntent, { passive: false });
    window.addEventListener("touchmove", handleScrollIntent, {
      passive: false,
    });
    window.addEventListener("scroll", handleClose, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleScrollIntent);
      window.removeEventListener("touchmove", handleScrollIntent);
      window.removeEventListener("scroll", handleClose);
    };
  });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled globally above
    <div
      className={`fixed inset-0 z-50 flex items-end justify-end transition-colors duration-500 ${
        phase === "gather" || phase === "return"
          ? "bg-transparent"
          : "bg-background"
      }`}
      role="dialog"
      aria-label="ASCII portrait of Kiryl. Press Escape or click to close."
      onClick={handleClose}
    >
      <div
        ref={gridRef}
        className="relative select-none"
        style={{
          // 6x12px cells (10px font), capped so it always fits the viewport
          fontSize: `min(10px, calc(96vw / ${portrait.cols * CHAR_WIDTH_EM}), calc(96vh / ${portrait.rows.length * LINE_HEIGHT_EM}))`,
          width: `${portrait.cols * CHAR_WIDTH_EM}em`,
          height: `${portrait.rows.length * LINE_HEIGHT_EM}em`,
          // portrait glyphs sit back at half strength; the landed letters stay full

          // in: fades alongside the flight, finishing as the last chars land
          // out: drops quickly so the returning letters fly over a clearing screen
        }}
      >
        {visibleCells.map((c) =>
          holes.has(c.row * portrait.cols + c.col) ? null : (
            <span
              key={c.row * portrait.cols + c.col}
              className="absolute text-center"
              style={{
                // em values are relative to the span's own reduced font-size,
                // so divide by GLYPH_SCALE to keep the grid geometry intact
                left: `${(c.col * CHAR_WIDTH_EM) / GLYPH_SCALE}em`,
                top: `${(c.row * LINE_HEIGHT_EM) / GLYPH_SCALE}em`,
                width: `${CHAR_WIDTH_EM / GLYPH_SCALE}em`,
                lineHeight: `${LINE_HEIGHT_EM / GLYPH_SCALE}em`,
                fontSize: `${GLYPH_SCALE}em`,
                opacity:
                  phase === "gather" || phase === "return"
                    ? 0
                    : 0.03 * c.level + 0.2,
                transition:
                  phase === "return"
                    ? "opacity 400ms ease"
                    : `opacity ${FLY_MS + MAX_STAGGER_MS - 100}ms ease 200ms`,
              }}
            >
              {c.glyph}
            </span>
          ),
        )}
      </div>
      {flights.map((f, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered
          key={i}
          className="fixed text-foreground pointer-events-none"
          style={{
            left: f.x,
            top: f.y,
            width: f.w,
            fontSize: f.fs,
            // zero leading: the Range rect is the font's content area, so this
            // reproduces the hero glyph's baseline exactly
            lineHeight: `${f.h}px`,
            transformOrigin: "center",
            opacity: phase === "gather" || phase === "return" ? 1 : 0.75,
            // untransformed at takeoff and return so the text swap is
            // pixel-identical; flies by shrinking toward the cell center
            transform:
              phase === "gather" || phase === "return"
                ? "none"
                : `translate(${f.dx}px, ${f.dy}px) scale(${f.scale})`,
            // return staggers last-in-first-out: the far stragglers leave first
            transition:
              phase === "gather"
                ? "none"
                : `transform ${FLY_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${
                    phase === "return" ? MAX_STAGGER_MS - f.delay : f.delay
                  }ms`,
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}
