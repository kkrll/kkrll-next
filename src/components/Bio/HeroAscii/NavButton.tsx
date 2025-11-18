const NavButton = ({
  text,
  onClick,
  isSelected = false,
}: {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 h-full text-xs font-mono text-foreground rounded transition-colors ${
        isSelected
          ? "bg-background pointer-none:"
          : "bg-background/30 hover:bg-background/70"
      }`}
    >
      {text}
    </button>
  );
};

export default NavButton;
