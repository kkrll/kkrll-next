/**
 * Cell Size Selector Component
 *
 * A popover control for adjusting cell size in the ASCII canvas.
 * Behavior differs by mode:
 * - Dot mode: Square cells (width = height)
 * - ASCII mode: Maintains ~10:16 aspect ratio for character rendering
 */

import { memo, useRef, useState, useEffect } from "react";
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
function calculateCellSize(width: number, style: RenderStyle, height?: number): CellSize {
  if (style === "Ascii") {
    return { width: width, height: Math.round(width * 2), };
  }
  // Dot/Palette mode - square or custom dimensions
  return {
    width: width,
    height: height || width,
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

    // Local state for Palette mode text inputs (committed on Enter/blur)
    const [widthInput, setWidthInput] = useState(cellSize.width.toString());
    const [heightInput, setHeightInput] = useState(cellSize.height.toString());

    const handleSizeChange = (value: number) => {
      const newCellSize = calculateCellSize(value, style);
      onCellSizeChange(newCellSize);
    };

    // Validate and clamp numeric input value
    const validateValue = (value: string, min: number, max: number): number => {
      const num = Number(value);
      if (Number.isNaN(num)) return min;
      return Math.max(min, Math.min(max, Math.floor(num)));
    };

    // Commit width/height changes (called on Enter or blur)
    const commitWidthChange = () => {
      const validWidth = validateValue(widthInput, 1, 10000);
      setWidthInput(validWidth.toString());
      onCellSizeChange({ width: validWidth, height: cellSize.height });
    };

    const commitHeightChange = () => {
      const validHeight = validateValue(heightInput, 1, 10000);
      setHeightInput(validHeight.toString());
      onCellSizeChange({ width: cellSize.width, height: validHeight });
    };

    // Handle Enter key to commit changes
    const handleWidthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commitWidthChange();
        e.currentTarget.blur();
      }
    };

    const handleHeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commitHeightChange();
        e.currentTarget.blur();
      }
    };

    // Sync local state when cellSize changes externally (e.g., Random button)
    useEffect(() => {
      setWidthInput(cellSize.width.toString());
      setHeightInput(cellSize.height.toString());
    }, [cellSize.width, cellSize.height]);

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
          {style === "Palette" ? (
            // Palette mode: text inputs with random button
            <div className="flex flex-col gap-2 pb-2">
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-mono text-foreground-07">
                    W:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value)}
                    onKeyDown={handleWidthKeyDown}
                    onBlur={commitWidthChange}
                    className="w-full px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded text-foreground"
                    aria-label="Cell width"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-mono text-foreground-07">
                    H:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    onKeyDown={handleHeightKeyDown}
                    onBlur={commitHeightChange}
                    className="w-full px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded text-foreground"
                    aria-label="Cell height"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const randomWidth = Math.floor(Math.random() * (MAX_CELL_SIZE * 4 - MIN_CELL_SIZE + 1)) + MIN_CELL_SIZE;
                  const randomHeight = Math.floor(Math.random() * (MAX_CELL_SIZE * 4 - MIN_CELL_SIZE + 1)) + MIN_CELL_SIZE;
                  onCellSizeChange({ width: randomWidth, height: randomHeight });
                }}
                className="px-2 py-1 text-xs font-mono bg-background-05 hover:bg-background-07 border border-foreground-05 rounded text-foreground transition-colors"
              >
                Random
              </button>
            </div>
          ) : (
            // Ascii/Dot mode: single slider
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
          )}
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
