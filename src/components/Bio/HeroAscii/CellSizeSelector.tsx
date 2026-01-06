/**
 * Cell Size Selector Component
 *
 * A popover control for adjusting cell size in the ASCII canvas.
 * Behavior differs by mode:
 * - Dot mode: Square cells (width = height)
 * - ASCII mode: Maintains ~10:16 aspect ratio for character rendering
 */

import { memo, useRef } from "react";
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
  // ASCII mode - maintain ~1:2 aspect ratio
  return {
    width: size,
    height: Math.round(size * 2),
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
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSizeChange = (value: number) => {
      const newCellSize = calculateCellSize(value, style);
      onCellSizeChange(newCellSize);
    };

    return (
      <div className="h-full">
        <button
          ref={buttonRef}
          popoverTarget="slider"
          className={`anchor-cell-size flex cursor-pointer gap-1 items-center bg-background/30 hover:bg-background/70 px-3 py-1 h-full rounded-xl`}
          aria-label={`Cell size: ${cellSize.width}×${cellSize.height} pixels`}
        >
          <label className="text-xs font-mono font-medium text-foreground-07 whitespace-nowrap">
            Cell:
          </label>
          <span className="font-mono text-xs w-11 text-right tabular-nums">
            {cellSize.width}×{cellSize.height}
          </span>
        </button>


        <div
          className="cell-slider px-2 pt-2 pb-[1px] bg-background border border-foreground/20 rounded-2xl shadow-lg"
          popover=""
          id="slider"
        >
          <input
            id="cell-size-slider"
            type="range"
            min={MIN_CELL_SIZE}
            max={MAX_CELL_SIZE}
            value={currentSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="w-full accent-foreground slider-tapered"
            aria-label={`Cell size: ${currentSize} pixels`}
          />
        </div>

      </div>
    );
  }
);

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
