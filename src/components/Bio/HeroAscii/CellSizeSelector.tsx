/**
 * Cell Size Selector Component
 *
 * A slider control for adjusting cell size in the ASCII canvas.
 * Behavior differs by mode:
 * - Dot mode: Square cells (width = height)
 * - ASCII mode: Maintains ~10:16 aspect ratio for character rendering
 */

import { memo } from "react";
import { MAX_CELL_SIZE, MIN_CELL_SIZE } from "./constants";
import "./styles.css";
import type { CellSize, RenderStyle } from "./types";

interface CellSizeSelectorProps {
  cellSize: CellSize;
  onCellSizeChange: (size: CellSize) => void;
  style: RenderStyle;
}

/**
 * Calculate cell size based on a single "size" value and the current style.
 * - Dot mode: width = height = size (square)
 * - ASCII mode: width = size, height = size * 1.6 (character aspect ratio)
 */
function calculateCellSize(size: number, style: RenderStyle): CellSize {
  if (style === "Dot") {
    return { width: size, height: size };
  }
  // ASCII mode - maintain ~10:16 aspect ratio
  return {
    width: size,
    height: Math.round(size * 1.6),
  };
}

/**
 * Get the "size" value from current cell size (for slider display)
 */
function getSizeValue(cellSize: CellSize): number {
  return cellSize.width;
}

const CellSizeSelector = memo(
  ({ cellSize, onCellSizeChange, style }: CellSizeSelectorProps) => {
    const currentSize = getSizeValue(cellSize);

    const handleSizeChange = (value: number) => {
      const newCellSize = calculateCellSize(value, style);
      onCellSizeChange(newCellSize);
    };

    return (
      <div className="flex items-center gap-3">
        <label
          htmlFor="cell-size-slider"
          className="text-xs font-mono font-medium whitespace-nowrap"
        >
          Cell
        </label>
        <input
          id="cell-size-slider"
          type="range"
          min={MIN_CELL_SIZE}
          max={MAX_CELL_SIZE}
          value={currentSize}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="accent-foreground slider-tapered w-16"
          aria-label={`Cell size: ${currentSize} pixels`}
        />
        <span className="font-mono text-xs w-12 text-center tabular-nums">
          {cellSize.width}×{cellSize.height}
        </span>
      </div>
    );
  }
);

CellSizeSelector.displayName = "CellSizeSelector";

export default CellSizeSelector;

/**
 * Helper to get default cell size for a given style
 */
export function getDefaultCellSize(style: RenderStyle): CellSize {
  if (style === "Dot") {
    return { width: 8, height: 8 };
  }
  return { width: 10, height: 16 };
}

/**
 * Helper to adjust cell size when switching styles
 * Tries to keep similar "resolution" when switching
 */
export function adjustCellSizeForStyle(
  currentSize: CellSize,
  newStyle: RenderStyle
): CellSize {
  // Use the width as the base and recalculate for new style
  return calculateCellSize(currentSize.width, newStyle);
}
