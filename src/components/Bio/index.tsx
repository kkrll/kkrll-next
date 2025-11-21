"use client";

import { useEffect, useState } from "react";

import { useTracking } from "@/hooks/useTracking";

import Link from "next/link";
import HeroAscii from "./HeroAscii";

const Bio = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [drawingMode, setDrawingMode] = useState<
    "brush" | "increment" | "decrement" | null
  >(null);
  const { track } = useTracking();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "b" || e.key === '1') {
        e.preventDefault();
        setDrawingMode('brush');
      }
      if (drawingMode && e.key === "2" || e.key === "d") {
        e.preventDefault();
        setDrawingMode('decrement');
      }
      if (drawingMode && e.key === "3" || e.key === "l") {
        e.preventDefault();
        setDrawingMode('increment');
      }
      if (drawingMode && e.key === "Escape") {
        e.preventDefault();
        setDrawingMode(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    if (drawingMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawingMode]);

  return (
    <>
      <HeroAscii
        drawingMode={drawingMode}
        setMode={setDrawingMode}
        onToggleDrawingMode={() => {
          if (!drawingMode) {
            setDrawingMode("brush");
          } else {
            setDrawingMode(null);
          }
        }}
      />{" "}
      <div className="absolute left-0 right-0 top-0 h-48 bg-gradient-to-b from-background to-transparent opacity-80 " />
      {/* Bio content - hidden in drawing mode */}
      {!drawingMode ? (
        <section className="relative min-h-hero md:min-h-[70vh] pt-[40vh] md:pt-[50vh] px-default z-10">
          <p className="mb-6 bg-background w-fit">Hey. </p>
          <p className=" bg-background w-fit">
            I'm Kiryl, a product designer at{" "}
            <a
              className="underline"
              href="https://www.zing.coach/"
              target="_blank"
              rel="noopener"
            >
              Zing Coach.
            </a>{" "}
          </p>
          <p className=" bg-background w-fit">
            You can find here some of my{" "}
            <Link className="underline" href={"/writings"}>
              articles
            </Link>
            ,{" "}
            <Link className="underline" href={"/posters"}>
              prints
            </Link>
            ,{" "}
            <Link className="underline" href={"/resume"}>
              resume
            </Link>
            , and something else, occasionally.
          </p>
          <p className=" bg-background w-fit">Welcome.</p>
          <div className="group flex py-6 gap-4 items-baseline ">
            <a
              className="bg-background w-fit nice-button"
              // className="underline bg-background w-fit"
              href="mailto:k_kov@hotmail.com?subject=Hey%20Kiryl!%20Big%20fan%20of%20yours..."
            >
              <span>
                Email me
              </span>
            </a>
            <button
              className="opacity-0 group-hover:opacity-100 cursor-pointer uppercase font-mono text-background-05 hover:text-foreground-07 transition-colors duration-100"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("k_kov@hotmail.com");
                setIsCopied(true);
                track("copy_email", { page: "home" });
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              {isCopied ? "Copied" : "Copy address"}
            </button>
          </div>
        </section>
      ) : (
        <section className="relative min-h-hero md:min-h-[70vh] pt-[50vh] px-default z-0"></section>
      )}
    </>
  );
};

export default Bio;
