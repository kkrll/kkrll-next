interface NavButtonProps {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}

const NavButton = ({
  text,
  onClick,
  isSelected = false,
  disabled = false,
  "aria-label": ariaLabel,
}: NavButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`px-3 py-1 h-full text-xs font-mono text-foreground rounded transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-background/30"
          : isSelected
            ? "bg-background pointer-none:"
            : "bg-background/30 hover:bg-background/70"
      }`}
    >
      {text}
    </button>
  );
};

export default NavButton;
