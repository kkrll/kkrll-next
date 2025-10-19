const NavButton = ({
  text,
  isSelected,
  onClick,
}: {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-8 h-8 text-sm font-mono rounded transition-colors ${
        isSelected
          ? "bg-background/100 text-foreground"
          : "bg-background/30 hover:bg-background/70 text-foreground"
      } ${text.length > 1 ? "px-4" : ""}`}
      title={text.length > 1 ? text : `Draw with: ${text || "space"}`}
    >
      {text}
    </button>
  );
};

export default NavButton;
