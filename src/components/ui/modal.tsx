"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

export const useModalState = () => {
  const [shouldRender, setShouldRender] = useState(false);

  const open = () => {
    setShouldRender(true);
  };

  const close = () => {
    setShouldRender(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: close function is stable
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shouldRender) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender]);

  return { isOpen: shouldRender, open, close };
};

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for close animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return createPortal(
    // biome-ignore lint/a11y/useSemanticElements: overlay backdrop needs to be a div for layout
    <div
      className={`
				fixed left-0 right-0 top-0 bottom-0 flex md:items-center items-end justify-center z-20 bg-b p-2
				${isClosing ? "animate-modal-overlay-close" : "animate-modal-overlay-open"}
			`}
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClose();
      }}
      role="button"
      tabIndex={0}
      aria-label="Close modal overlay"
    >
      <div
        className={`
					p-4 rounded-[56px] bg-foreground/10 shadow-2xl border border-foreground/20
					${isClosing ? "animate-modal-close" : "animate-modal-open"}
				`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex no-scrollbar flex-col g-6 [&_p]:max-w-[540px] bg-background/95 p-8 md:p-24 rounded-[44px] w-full max-w-[960px] max-h-[calc(100vh-48px)] md:max-h-[75vh] overflow-y-scroll ">
          {children}
          <Button onClick={handleClose} className="w-fit">
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
