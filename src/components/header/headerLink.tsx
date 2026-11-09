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
      // No text size: inherits body type (14/21), the same as the home
      // page's KKRLL heading — home is the reference for this label.
      <Link href={to} className="font-mono uppercase p-2 cursor-pointer">
        {children}
      </Link>
    );
  if (onClick)
    return (
      <Button
        variant={"link"}
        onClick={onClick}
        className="font-mono font-normal uppercase p-2 cursor-pointer"
      >
        {children}
      </Button>
    );
  return children;
};

export default HeaderLink;
