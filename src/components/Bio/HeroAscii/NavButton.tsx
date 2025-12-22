import { ReactNode } from "react";

interface NavButtonProps {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  icon?: ReactNode
}

const NavButton = ({
  text,
  onClick,
  isSelected = false,
  disabled = false,
  "aria-label": ariaLabel,
  icon
}: NavButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`cursor-pointer flex justify-center items-center py-1 min-h-8 h-full text-xs font-mono text-foreground rounded-xl transition-colors ${disabled
        ? "opacity-50 cursor-not-allowed bg-background/30"
        : isSelected
          ? "bg-background pointer-none:"
          : "bg-background/30 hover:bg-background/70"
        } ${icon ? "w-8" : "px-3"
        }
        `}
    >
      {icon ? icon : text}
    </button>
  );
};

export default NavButton;
