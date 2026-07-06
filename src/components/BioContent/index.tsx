"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTracking } from "@/hooks/useTracking";
import { measureHeroChars, type SourceChar } from "./measureHeroChars";

// Easter egg: loaded only when triggered, keeps the levels data out of the main bundle
const AsciiPortrait = dynamic(() => import("./AsciiPortrait"), { ssr: false });

const BioContent = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [sourceChars, setSourceChars] = useState<SourceChar[] | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { track } = useTracking();
  const showPortrait = sourceChars !== null;

  const handleKirylClick = () => {
    // if (!window.matchMedia("(min-width: 768px) and (pointer: fine)").matches)
    //   return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setSourceChars(
      reduceMotion || !sectionRef.current
        ? []
        : measureHeroChars(sectionRef.current),
    );
    track("portrait_open", { page: "home" });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative min-h-hero md:min-h-[70vh] pt-[40vh] md:pt-[50vh] px-default ${showPortrait ? "invisible z-[60]" : "z-10"
          }`}
      >
        <p className="mb-6 bg-background w-fit">Hey. </p>
        <p className=" bg-background w-fit">
          I'm{" "}
          <button
            type="button"
            data-keep
            className={showPortrait ? "visible pointer-events-none" : "cursor-pointer underline"}
            onClick={handleKirylClick}
          >
            Kiryl
          </button>
          <span
            aria-hidden={!showPortrait}
            className={`absolute pointer-events-none transition-opacity ${showPortrait ? "visible" : ""
              } ${showPortrait && !isClosing
                ? "opacity-100 duration-500 delay-500"
                : "opacity-0 duration-300 delay-0"
              }`}
          >
            {" looks like this"}
          </span>
          <span
            aria-hidden={!showPortrait}
            className={`absolute left-[180px] pointer-events-none transition-opacity ${showPortrait ? "visible" : ""
              } ${showPortrait && !isClosing
                ? "opacity-100 duration-500 delay-2000"
                : "opacity-0 duration-300 delay-0"
              }`}
          >
            {", if you wondered"}
          </span>
          , a product designer at{" "}
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
            <span>Email me</span>
          </a>
          <button
            className="opacity-0 group-hover:opacity-100 cursor-pointer uppercase text-sm font-mono text-background-05 hover:text-foreground-07 transition-[colors_opacity] duration-200"
            type="button"
            onTouchStart={() => navigator.vibrate(10)}
            onTouchEnd={() => navigator.vibrate(10)}
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
      {showPortrait && (
        <AsciiPortrait
          sourceChars={sourceChars}
          onCloseStart={() => setIsClosing(true)}
          onClose={() => {
            setSourceChars(null);
            setIsClosing(false);
          }}
        />
      )}
    </>
  );
};

export default BioContent;
