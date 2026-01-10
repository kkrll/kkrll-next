// ============================================
// Mode Types
// ============================================

export type DrawingModes = "brush" | "increment" | "decrement" | "eraser" | null

// ============================================
// Core Cell Types
// ============================================

/** Base cell representing a single character position in the ASCII grid */
export interface CharCell {
  baseLevel: number;
  currentLevel: number;
  col: number;
  row: number;
  isTransparent?: boolean;
}

/** Extended cell with RGB color data from source image */
export interface ColorCharCell extends CharCell {
  /** Red channel (0-255) */
  r: number;
  /** Green channel (0-255) */
  g: number;
  /** Blue channel (0-255) */
  b: number;
}

/** Canvas foreground/background colors from CSS */
export interface Colors {
  bg: string;
  fg: string;
}

// ============================================
// Source Image Storage
// ============================================

/**
 * Stores the original image for grid regeneration.
 * ImageBitmap is GPU-backed and efficient for repeated drawing operations.
 * Remember to call bitmap.close() when replacing to free GPU memory.
 */
export interface SourceImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

// ============================================
// Edit Overlay System
// ============================================

/**
 * Stores user edits at pixel-level resolution.
 * Uses sparse Map storage - only edited pixels are stored.
 * Coordinates are in "source image space" for resolution independence.
 */
export interface EditOverlay {
  /** Map of "x,y" coordinate strings to edit data */
  edits: Map<string, EditPixel>;
  /** Overlay dimensions (typically matches source image or screen size) */
  width: number;
  height: number;
}

/**
 * Single pixel edit data.
 * Either stores an absolute level (brush mode) or a delta (increment/decrement).
 */
export interface EditPixel {
  /** Absolute level when using brush mode (0 to maxLevel) */
  level?: number;
  /** Level delta when using increment/decrement mode */
  delta?: number;
  /** Which drawing mode created this edit */
  mode: DrawingModes;
}


// ============================================
// Configuration Types
// ============================================

/** Cell dimensions in pixels */
export interface CellSize {
  width: number;
  height: number;
}

/** Color rendering mode */
export type ColorMode = "monochrome" | "original" | "mixed";

/** Style/rendering mode */
export type RenderStyle = "Ascii" | "Dot" | "Palette";

/** Image fitting mode (similar to CSS object-fit) */
export type FitMode = "contain" | "cover";

// ============================================
// Render Settings
// ============================================

/**
 * All settings that affect how the grid is rendered.
 * Stored in a ref to avoid re-renders when settings change.
 */
export interface RenderSettings {
  style: RenderStyle;
  invert: boolean;
  colorMode: ColorMode;
  cellSize: CellSize;
}

// ============================================
// Worker Communication Types
// ============================================

/** Input data sent to the image conversion worker */
export interface WorkerInput {
  imageBitmap: ImageBitmap;
  cols: number;
  rows: number;
  asciiChars: string[];
  cellWidth: number;
  cellHeight: number;
  /** How to fit image: "contain" (letterbox) or "cover" (fill, crop edges) */
  fitMode: FitMode;
  blackPoint: number;
  whitePoint: number;
  /** Invert levels at conversion time for light mode */
  invert: boolean;
}

/** Successful result from the worker */
export interface WorkerOutputSuccess {
  success: true;
  grid: ColorCharCell[];
}

/** Error result from the worker */
export interface WorkerOutputError {
  success: false;
  error: string;
}

export type WorkerOutput = WorkerOutputSuccess | WorkerOutputError;
