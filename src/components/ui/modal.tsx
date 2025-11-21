"use client";

import { createPortal, flushSync } from "react-dom";
import { Button } from "./button";
import { ReactNode, useEffect, useState } from "react";

export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setIsOpen(true));
      });
    } else {
      setIsOpen(true);
    }
  };
  const close = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setIsOpen(false));
      });
    } else {
      setIsOpen(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: view transitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return { isOpen, open, close };
};

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => {
  return createPortal(
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 bg-background/70 flex md:items-center items-end justify-center z-20 p-6`}
      style={{ viewTransitionName: "fade-from-bottom" }}
    >
      <div className="flex flex-col items-center justify-center bg-foreground-05/50 backdrop-blur-2xl p-24 rounded-4xl w-full max-w-[512px]">
        {children}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
