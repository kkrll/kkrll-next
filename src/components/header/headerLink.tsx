import { Button } from "../ui/button";
import Link from "next/link";

const HeaderLink = ({
  to,
  children,
  onClick,
}: {
  to?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  if (to)
    return (
      <Link href={to} className="font-mono uppercase text-sm">
        {children}
      </Link>
    );
  if (onClick)
    return (
      <Button
        variant={"link"}
        onClick={onClick}
        className="font-mono font-normal uppercase text-sm px-0"
      >
        {children}
      </Button>
    );
  return children;
};

export default HeaderLink;
