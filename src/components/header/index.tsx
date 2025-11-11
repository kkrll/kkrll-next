"use client";

import { useEffect, useState } from "react";
import HeaderLink from "./headerLink";
import { Button } from "../ui/button";
import { createPortal, flushSync } from "react-dom";
import ThemeSwitcher from "../ThemeSwitcher";

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  return createPortal(
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 bg-background/70 flex md:items-center items-end justify-center z-20 p-6`}
      style={{ viewTransitionName: "fade-from-bottom" }}
    >
      <div className="flex flex-col items-center justify-center bg-foreground-05/50 backdrop-blur-2xl p-24 rounded-4xl w-full max-w-[512px]">
        contact popup
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>,
    document.body
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setIsOpen(true);
        });
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setIsOpen(false);
        });
      });
    } else {
      setIsOpen(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: view transitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header
      className="w-full flex z-10 items-center justify-between mb-8 py-8 px-4 md:px-2
  md:p-4"
    >
      <HeaderLink to="/">kkrll</HeaderLink>
      <nav className="flex gap-0 md:gap-2">
        <ThemeSwitcher />
        <HeaderLink to="/resume">resume</HeaderLink>
        <HeaderLink onClick={handleOpen}>contact</HeaderLink>
      </nav>
      {isOpen && <ContactModal onClose={handleClose} />}
    </header>
  );
};

export default Header;
