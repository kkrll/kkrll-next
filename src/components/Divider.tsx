type DividerProps = {
  vertical?: boolean;
  className?: string;
};

const Divider = ({ vertical = false, className = "" }: DividerProps) => {
  return (
    <div
      className={`bg-foreground ${
        vertical ? "w-[1px] h-full" : "h-[1px] w-full"
      } ${className}`}
    />
  );
};

export default Divider;
