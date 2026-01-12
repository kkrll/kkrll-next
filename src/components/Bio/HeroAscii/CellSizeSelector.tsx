/**
 * Cell Size Selector Component
 *
 * A popover control for adjusting cell size in the ASCII canvas.
 * Behavior differs by mode:
 * - Dot mode: Square cells (width = height) via slider
 * - ASCII mode: Maintains ~10:16 aspect ratio via slider
 * - Palette mode: Variable cell dimensions with range inputs + Shuffle
 */

import { memo, useRef, useState, useEffect } from "react";
import { DEFAULT_CELL_WIDTH, MAX_CELL_SIZE, MIN_CELL_SIZE } from "./constants";
import "./styles.css";
import type { CellSize, CellSizeRange, RenderStyle } from "./types";

interface CellSizeSelectorProps {
  cellSize: CellSize;
  onCellSizeChange: (size: CellSize) => void;
  style: RenderStyle;
  /** Range settings for Palette mode variable dimensions */
  cellSizeRange?: CellSizeRange;
  /** Called when range changes in Palette mode */
  onCellSizeRangeChange?: (range: CellSizeRange) => void;
  /** Called when Shuffle button is clicked in Palette mode */
  onShuffle?: () => void;
}

/**
 * Calculate cell size based on a single "size" value and the current style.
 * - Dot mode: width = height = size (square)
 * - ASCII mode: width = size, height = size * 2 (character aspect ratio)
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
  ({
    cellSize,
    onCellSizeChange,
    style,
    cellSizeRange,
    onCellSizeRangeChange,
    onShuffle,
  }: CellSizeSelectorProps) => {
    const currentSize = getSizeValue(cellSize);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Local state for range inputs (Palette mode)
    const [minWidthInput, setMinWidthInput] = useState(
      cellSizeRange?.minWidth.toString() ?? DEFAULT_CELL_WIDTH.toString()
    );
    const [maxWidthInput, setMaxWidthInput] = useState(
      cellSizeRange?.maxWidth.toString() ?? DEFAULT_CELL_WIDTH.toString()
    );
    const [minHeightInput, setMinHeightInput] = useState(
      cellSizeRange?.minHeight.toString() ?? DEFAULT_CELL_WIDTH.toString()
    );
    const [maxHeightInput, setMaxHeightInput] = useState(
      cellSizeRange?.maxHeight.toString() ?? DEFAULT_CELL_WIDTH.toString()
    );

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

    // Commit range changes (called on Enter or blur)
    const commitRangeChange = () => {
      if (!onCellSizeRangeChange) return;

      const minW = validateValue(minWidthInput, 1, 2000);
      const maxW = validateValue(maxWidthInput, 1, 2000);
      const minH = validateValue(minHeightInput, 1, 2000);
      const maxH = validateValue(maxHeightInput, 1, 2000);

      // Update local state with validated values
      setMinWidthInput(minW.toString());
      setMaxWidthInput(maxW.toString());
      setMinHeightInput(minH.toString());
      setMaxHeightInput(maxH.toString());

      // Ensure min <= max
      const newRange: CellSizeRange = {
        minWidth: Math.min(minW, maxW),
        maxWidth: Math.max(minW, maxW),
        minHeight: Math.min(minH, maxH),
        maxHeight: Math.max(minH, maxH),
      };

      onCellSizeRangeChange(newRange);
    };

    // Handle Enter key to commit changes
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commitRangeChange();
        e.currentTarget.blur();
      }
    };

    // Sync local state when cellSizeRange changes externally
    useEffect(() => {
      if (!cellSizeRange) return;
      setMinWidthInput(cellSizeRange.minWidth.toString());
      setMaxWidthInput(cellSizeRange.maxWidth.toString());
      setMinHeightInput(cellSizeRange.minHeight.toString());
      setMaxHeightInput(cellSizeRange.maxHeight.toString());
    }, [cellSizeRange]);

    // Display text for button - show range if variable, single size otherwise
    const getDisplayText = () => {
      if (style === "Palette" && cellSizeRange) {
        const isUniform =
          cellSizeRange.minWidth === cellSizeRange.maxWidth &&
          cellSizeRange.minHeight === cellSizeRange.maxHeight;
        if (isUniform) {
          return `${cellSizeRange.minWidth}×${cellSizeRange.minHeight}`;
        }
        return "Random";
      }
      return `${cellSize.width}×${cellSize.height}`;
    };

    return (
      <div className="h-full">
        <button
          ref={buttonRef}
          popoverTarget="slider"
          className={`anchor-cell-size flex cursor-pointer gap-1 items-center bg-background/30 hover:bg-background/70 px-3 py-1 h-full rounded-xl`}
          aria-label={`Cell size: ${getDisplayText()} pixels`}
        >
          <label className="text-xs font-mono font-medium text-foreground-07 whitespace-nowrap">
            Cell:
          </label>
          <span className="font-mono text-xs text-right tabular-nums">
            {getDisplayText()}
          </span>
        </button>


        <div
          className="cell-slider px-2 pt-2 pb-[1px] bg-background border border-foreground/20 rounded-2xl shadow-lg"
          popover=""
          id="slider"
        >
          {style === "Palette" ? (
            // Palette mode: range inputs with shuffle button
            <div className="flex flex-col gap-2 pb-2">
              {/* Width range */}
              <div className="flex gap-2 items-center">
                <label className="text-xs font-mono text-foreground-07 w-6">W:</label>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={minWidthInput}
                  onChange={(e) => setMinWidthInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commitRangeChange}
                  className="w-16 px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded-xl text-foreground"
                  aria-label="Minimum width"
                  placeholder="from"
                />
                <span className="text-xs text-foreground-07">→</span>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={maxWidthInput}
                  onChange={(e) => setMaxWidthInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commitRangeChange}
                  className="w-16 px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded-xl text-foreground"
                  aria-label="Maximum width"
                  placeholder="to"
                />
              </div>
              {/* Height range */}
              <div className="flex gap-2 items-center">
                <label className="text-xs font-mono text-foreground-07 w-6">H:</label>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={minHeightInput}
                  onChange={(e) => setMinHeightInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commitRangeChange}
                  className="w-16 px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded-xl text-foreground"
                  aria-label="Minimum height"
                  placeholder="from"
                />
                <span className="text-xs text-foreground-07">→</span>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={maxHeightInput}
                  onChange={(e) => setMaxHeightInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commitRangeChange}
                  className="w-16 px-2 py-1 text-xs font-mono bg-background-05 border border-foreground-05 rounded-xl text-foreground"
                  aria-label="Maximum height"
                  placeholder="to"
                />
              </div>
              {/* Shuffle button */}
              <button
                type="button"
                onClick={() => onShuffle?.()}
                className="px-2 py-2 mt-1 text-xs font-mono bg-background-05 hover:bg-background-07 border border-foreground-05 rounded-xl text-foreground transition-colors"
              >
                Shuffle
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
