/**
 * Palette Color Picker Component
 *
 * An elegant control for selecting colors in Palette mode.
 * Shows a color swatch preview that opens native HTML5 color picker.
 * Expands to show preview when brush mode is active.
 */

import { memo, useRef } from "react";
import "./styles.css";
import { Brush } from "@/components/ui/icons";

interface PaletteColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onModeSelect: () => void;
  isSelected: boolean;
}

const PaletteColorPicker = memo(
  ({
    selectedColor,
    onSelectColor,
    onModeSelect,
    isSelected,
  }: PaletteColorPickerProps) => {
    const colorInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="flex items-center gap-1 h-full">
        <div
          className={`flex gap-2 pl-2 duration-150 items-center py-1 min-h-8 min-w-8 h-full text-xs font-mono text-foreground rounded-xl transition-all ${isSelected
              ? "bg-background pr-1 max-w-32"
              : "bg-background/30 hover:bg-background/70 max-w-8 cursor-pointer"
            }`}
        >
          <button
            onClick={() => {
              if (!isSelected) onModeSelect();
            }}
            type="button"
            className="min-w-0 min-h-0 p-0 bg-transparent border-0"
          >
            <Brush />
          </button>
          {isSelected && (
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className={`cursor-pointer flex items-center h-6 w-6 justify-center rounded-lg border border-foreground/20 transition-all duration-200 ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                }`}
              style={{ backgroundColor: selectedColor }}
              title={selectedColor}
              aria-label={`Selected color: ${selectedColor}`}
            >
              {/* Hidden native color input */}
              <input
                ref={colorInputRef}
                type="color"
                value={selectedColor}
                onChange={(e) => onSelectColor(e.target.value)}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default PaletteColorPicker;
