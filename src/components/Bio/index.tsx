"use client";

import { useEffect, useState } from "react";

import HeroAscii from "./HeroAscii";
import { DrawingModes } from "./HeroAscii/types";
import { useRouter, useSearchParams } from "next/navigation";
import BioContent from "../BioContent";

const Bio = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawingMode, setDrawingMode] = useState<DrawingModes>(() => {
    return searchParams.get("draw") === "true" ? "brush" : null
  });


  function switchDrawingMode(mode: DrawingModes) {
    setDrawingMode(mode)
    if (mode === null) {
      router.replace("/", { scroll: false })
    } else {
      router.replace("/?draw=true", { scroll: false })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "b" || e.key === "1") {
        e.preventDefault();
        switchDrawingMode("brush");
      }
      if ((drawingMode && e.key === "2") || (drawingMode && e.key === "d")) {
        e.preventDefault();
        switchDrawingMode("decrement");
      }
      if ((drawingMode && e.key === "3") || (drawingMode && e.key === "l")) {
        e.preventDefault();
        switchDrawingMode("increment");
      }
      if (drawingMode && e.key === "Escape") {
        e.preventDefault();
        switchDrawingMode(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    if (drawingMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawingMode, switchDrawingMode]);

  return (
    <>
      <HeroAscii
        drawingMode={drawingMode}
        setMode={switchDrawingMode}
        onToggleDrawingMode={() => {
          if (!drawingMode) {
            switchDrawingMode("brush");
          } else {
            switchDrawingMode(null);
          }
        }}
      />
      {/* Bio content - hidden in drawing mode */}
      {!drawingMode ? (
        <BioContent />
      ) : (
        <section className="relative min-h-hero md:min-h-[70vh] pt-[50vh] px-default z-0"></section>
      )}
    </>
  );
};

export default Bio;
