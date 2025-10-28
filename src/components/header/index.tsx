"use client";

import { useEffect, useState } from "react";
import HeaderLink from "./headerLink";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="w-full flex z-10 items-center justify-between mb-8 p-8 md:p-4">
      <HeaderLink to="/">kkrll</HeaderLink>
      <nav className="flex gap-4 items-baseline">
        <HeaderLink to="/resume">resume</HeaderLink>
        <HeaderLink onClick={() => setIsOpen(true)}>contact</HeaderLink>
      </nav>
      {isOpen &&
        createPortal(
          <div className="absolute left-0 right-0 top-0 bottom-0 bg-background/70 flex md:items-center items-end justify-center z-20 p-6">
            <div className="flex flex-col items-center justify-center bg-foreground-05/50 backdrop-blur-2xl p-24 rounded-4xl w-full max-w-[512px]">
              contact popup
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;
