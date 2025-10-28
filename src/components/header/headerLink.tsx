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
  if (to) return <Link href={to}>{children}</Link>;
  if (onClick)
    return (
      <Button variant={"link"} onClick={onClick}>
        {children}
      </Button>
    );
  return children;
};

export default HeaderLink;
