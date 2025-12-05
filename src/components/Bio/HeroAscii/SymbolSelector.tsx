import { memo } from "react";
import { IMAGE_ASCII_CHARS } from "./constants";
import "./styles.css";
import NavButton from "./NavButton";

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
    // Use IMAGE_ASCII_CHARS directly - no need to copy since we only read from it
    const radius = selectedSymbol / 1.66;

    return (
      <div className="flex items-center gap-3 h-full">
        <NavButton
          onClick={onModeSelect}
          isSelected={isSelected}
          text="Brush"
        />
        {/*<label
            htmlFor="thickness-slider"
            className="text-sm font-mono font-medium"
          >
            Brush
          </label>*/}
        <input
          id="thickness-slider"
          type="range"
          min="0"
          max={IMAGE_ASCII_CHARS.length - 1}
          value={selectedSymbol}
          onChange={(e) => onSelectSymbol(Number(e.target.value))}
          className="accent-foreground slider-tapered"
        />
        <span className="flex items-center justify-center font-mono text-xs w-8 h-8 rounded-lg text-center bg-background/70 text-foreground">
          {style === "Dot" ? (
            <svg width="32" height="32" viewBox="0 0 32 32">
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
        </span>{" "}
      </div>
    );
  }
);

export default SymbolSelector;
