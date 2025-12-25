'use client'

import { useState } from "react";
import Link from "next/link";
import { useTracking } from "@/hooks/useTracking";

const BioContent = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { track } = useTracking();

  return (
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
          <span>Email me</span>
        </a>
        <button
          className="opacity-0 group-hover:opacity-100 cursor-pointer uppercase font-mono text-background-05 hover:text-foreground-07 transition-colors duration-100"
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
  )
}

export default BioContent
