import Link from "next/link";
import { Button } from "../ui/button";

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
      <Link
        href={to}
        className="font-mono uppercase text-sm lg:text-base p-2 cursor-pointer"
      >
        {children}
      </Link>
    );
  if (onClick)
    return (
      <Button
        variant={"link"}
        onClick={onClick}
        className="font-mono font-normal uppercase text-sm lg:text-base p-2 cursor-pointer"
      >
        {children}
      </Button>
    );
  return children;
};

export default HeaderLink;
