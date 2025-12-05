/**
 * Color Mode Toggle Component
 *
 * Toggles between original colors and monochrome rendering.
 * Disabled when no source image is loaded (no color data available).
 */

import { memo } from "react";
import NavButton from "./NavButton";
import type { ColorMode } from "./types";

interface ColorModeToggleProps {
  colorMode: ColorMode;
  onToggle: () => void;
  disabled?: boolean;
}

const ColorModeToggle = memo(
  ({ colorMode, onToggle, disabled = false }: ColorModeToggleProps) => {
    const label = colorMode === "original" ? "Color" : "Mono";

    return (
      <NavButton
        text={label}
        onClick={onToggle}
        disabled={disabled}
        aria-label={`Color mode: ${colorMode}. Click to toggle.`}
      />
    );
  },
);

ColorModeToggle.displayName = "ColorModeToggle";

export default ColorModeToggle;
