"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./button";

export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Escape is handled natively by <dialog>, so there is no key listener here.
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

/**
 * Native <dialog> in the top layer: focus trap, Escape, inert background and
 * ::backdrop all come from the platform. No portal, no key listener, no
 * role/aria-modal props.
 *
 * Exit timing is owned by CSS. The close animation runs, and onAnimationEnd
 * unmounts — so the unmount can never drift out of sync with the stylesheet
 * the way a setTimeout does.
 */
const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const requestClose = () => setIsClosing(true);

  return (
    <dialog
      ref={dialogRef}
      data-closing={isClosing || undefined}
      className={`app-modal ${isClosing ? "animate-modal-close" : "animate-modal-open"}`}
      // Escape: take over so the exit animation runs before unmount.
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      // A click landing on the dialog itself is a click on the backdrop area.
      onClick={(e) => {
        if (e.target === dialogRef.current) requestClose();
      }}
      onAnimationEnd={(e) => {
        if (isClosing && e.target === dialogRef.current) onClose();
      }}
    >
      <div className="p-4 rounded-3xl bg-foreground/10 border border-foreground/20">
        <div className="flex no-scrollbar flex-col gap-6 [&_p]:max-w-[540px] bg-background/95 p-8 md:p-24 rounded-lg w-full max-w-[960px] max-h-[calc(100dvh-48px)] md:max-h-[75vh] overflow-y-scroll">
          {children}
          <Button onClick={requestClose} className="w-fit">
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
