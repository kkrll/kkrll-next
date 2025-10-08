"use client";

import { useState } from "react";
import Link from "next/link";

const Bio = () => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <section className="min-h-hero md:min-h-[70vh] pt-[50vh] px-8 md:px-4">
      <p className="mb-6">Hey. </p>
      <p>I'm Kiryl, a product designer at Zing Coach. </p>
      <p>
        d You can find here some of my{" "}
        <Link className="underline" href={"/writings"}>
          articles
        </Link>
        ,{" "}
        <Link className="underline" href={"/resume"}>
          resume
        </Link>
        ,{" "}
        <Link className="underline" href={"/posters"}>
          posters
        </Link>
        , and something else, occasionally.
      </p>
      <p>Welcome.</p>
      <div className="group flex py-6 gap-4 items-baseline">
        <a
          className="underline"
          href="mailto:k_kov@hotmail.com?subject=Hey%20Kiryl!%20Big%20fan%20of%20yours..."
        >
          Email me
        </a>
        <button
          className="opacity-0 group-hover:opacity-100 cursor-pointer uppercase font-mono text-background-05 hover:text-foreground-07 transition-colors duration-100"
          type="button"
          onClick={() => {
            navigator.clipboard.writeText("k_kov@hotmail.com");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }}
        >
          {isCopied ? "Copied" : "Copy address"}
        </button>
      </div>
    </section>
  );
};

export default Bio;
