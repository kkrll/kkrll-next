import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ComponentProps } from "react";

const TransitionLink = ({
  href,
  children,
  ...props
}: ComponentProps<typeof Link>) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Wait for component to mount before using router
  useEffect(() => {
    setIsReady(true);
  }, []);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isReady) return;
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.button !== 0 ||
      props.target === "_blank" ||
      typeof href !== "string" ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
