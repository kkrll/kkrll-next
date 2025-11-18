import { memo, RefObject, KeyboardEventHandler } from "react";
import { DRAW_ASCII_CHARS, IMAGE_ASCII_CHARS } from "./constants";
import "./styles.css";

interface SymbolSelectorProps {
  selectedSymbol: number;
  onSelectSymbol: (index: number) => void;
}

const SymbolSelector = memo(
  ({ selectedSymbol, onSelectSymbol }: SymbolSelectorProps) => {
    const symbols = [...IMAGE_ASCII_CHARS, ...DRAW_ASCII_CHARS];
    return (
      <div className="flex gap-1">
        <div className="px-2 flex items-center gap-3">
          <label
            htmlFor="thickness-slider"
            className="text-sm font-mono font-medium"
          >
            Brush
          </label>
          <input
            id="thickness-slider"
            type="range"
            min="0"
            max={symbols.length - 1}
            value={selectedSymbol}
            onChange={(e) => onSelectSymbol(Number(e.target.value))}
            className="accent-foreground slider-tapered"
          />
          <span className="flex items-center justify-center font-mono text-xs w-8 h-8 rounded-lg text-center bg-background/70 text-foreground ">
            {symbols[selectedSymbol]}
          </span>{" "}
        </div>
      </div>
    );
  },
);

export default SymbolSelector;
