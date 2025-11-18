const NavButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
    >
      {text}
    </button>
  );
};

export default NavButton;
