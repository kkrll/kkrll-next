/**
 * Symbol Selector Component
 *
 * A popover control for adjusting brush thickness in the ASCII canvas.
 * Shows visual preview of current brush (ASCII character or dot circle).
 * Only displays the thickness button when brush mode is active.
 */

import { memo, useRef } from "react";
import { IMAGE_ASCII_CHARS } from "./constants";
import "./styles.css";
import NavButton from "./NavButton";
import Divider from "@/components/Divider";
import { Brush } from "@/components/ui/icons";

interface SymbolSelectorProps {
  selectedSymbol: number;
  onSelectSymbol: (index: number) => void;
  onModeSelect: () => void;
  isSelected: boolean;
  style: "Ascii" | "Dot";
}

const SymbolSelector = memo(
  ({
    selectedSymbol,
    onSelectSymbol,
    onModeSelect,
    isSelected,
    style,
  }: SymbolSelectorProps) => {
    const radius = selectedSymbol / 1.66;
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div className="flex items-center gap-1 h-full">
        <NavButton
          onClick={onModeSelect}
          isSelected={isSelected}
          text="Brush"
          icon={<Brush />}
        />

        {isSelected && (
          <>
            <Divider vertical className="bg-foreground-07/20 mx-2" />
            <button
              type="button"
              ref={buttonRef}
              popoverTarget="brush-slider"
              className="anchor-brush flex cursor-pointer gap-1 items-center bg-background/30 hover:bg-background/70 pl-3 pr-1 py-1 h-full rounded-xl"
            >
              <span className="text-xs font-mono font-medium text-foreground-07 whitespace-nowrap">
                Size:
              </span>
              <span className="flex items-center h-6 w-6 justify-center font-mono text-xs rounded-lg text-center bg-background/70 text-foreground">
                {style === "Dot" ? (
                  <svg width="24" height="24" viewBox="0 0 32 32">
                    <title>brush size</title>
                    <circle
                      cx="16"
                      cy="16"
                      r={Math.min(radius, 12)}
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  IMAGE_ASCII_CHARS[selectedSymbol]
                )}
              </span>
            </button>

            <div
              className="brush-slider px-2 pt-2 pb-[1px] bg-background border border-foreground/20 rounded-2xl shadow-lg"
              popover=""
              id="brush-slider"
            >
              <input
                id="thickness-slider"
                type="range"
                min="0"
                max={IMAGE_ASCII_CHARS.length - 1}
                value={selectedSymbol}
                onChange={(e) => onSelectSymbol(Number(e.target.value))}
                className="w-full accent-foreground slider-tapered"
                aria-label={`Brush thickness: ${selectedSymbol}`}
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

export default SymbolSelector;
