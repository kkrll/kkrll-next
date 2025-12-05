import type { CellSize, RenderStyle } from "./types";

// ============================================
// ASCII Character Set
// ============================================

/**
 * Characters ordered by visual density (darkest to brightest).
 * Used for mapping luminance levels to ASCII art.
 */
export const IMAGE_ASCII_CHARS = [
  " ",
  "·",
  "-",
  ":",
  "+",
  "i",
  "s",
  "x",
  "※",
  "8",
  "@",
  "W",
];

// ============================================
// Cell Size Configuration
// ============================================

/** Minimum cell size in pixels (prevents too many cells) */
export const MIN_CELL_SIZE = 4;

/** Maximum cell size in pixels (prevents too few cells) */
export const MAX_CELL_SIZE = 24;

/** Default cell width for ASCII mode */
export const DEFAULT_CELL_WIDTH = 10;

/** Default cell height for ASCII mode (taller for character aspect ratio) */
export const DEFAULT_CELL_HEIGHT = 16;

/** Default cell size for Dot mode (square cells) */
export const DEFAULT_DOT_SIZE = 8;

/** Default cell sizes per rendering style */
export const DEFAULT_CELL_SIZES: Record<RenderStyle, CellSize> = {
  Ascii: { width: DEFAULT_CELL_WIDTH, height: DEFAULT_CELL_HEIGHT },
  Dot: { width: DEFAULT_DOT_SIZE, height: DEFAULT_DOT_SIZE },
};

// ============================================
// Legacy exports (for backward compatibility)
// ============================================

/** @deprecated Use DEFAULT_CELL_WIDTH instead */
export const CHAR_WIDTH = DEFAULT_CELL_WIDTH;

/** @deprecated Use DEFAULT_CELL_HEIGHT instead */
export const CHAR_HEIGHT = DEFAULT_CELL_HEIGHT;

// ============================================
// Font & Rendering
// ============================================

/** Font for ASCII character rendering */
export const FONT = "14px 'Geist Mono', monospace";

/** Available rendering styles */
export const STYLES: RenderStyle[] = ["Ascii", "Dot"];

// ============================================
// Edit Overlay Configuration
// ============================================

/**
 * Maximum resolution for edit overlay (limits memory usage).
 * Edits are stored at this resolution regardless of screen size.
 */
export const EDIT_OVERLAY_MAX_DIMENSION = 1920;
