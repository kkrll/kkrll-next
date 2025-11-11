"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PosterInfoProps {
  title: string;
  date: string;
  description?: string;
  sm: string;
  lg: string;
  external?: string;
  content?: string;
  slug: string;
}

export default function PosterInfo({
  title,
  date,
  description,
  sm,
  lg,
  external,
}: PosterInfoProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollTopRef = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollDiff = Math.abs(scrollTop - lastScrollTopRef.current);

    if (scrollDiff < 32) return;

    if (scrollTop > 100 && scrollTop > lastScrollTopRef.current) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }

    lastScrollTopRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block font-mono md:sticky md:top-8 pt-[30vh] max-h-screen">
        <h1 className="text-md md:text-2xl mb-0 font-mono uppercase">
          {title}
        </h1>
        <p className="text-sm text-foreground/60 mb-4 md:mb-6">{date}</p>

        {description && <p className="mb-4 md:mb-6 text-sm ">{description}</p>}

        <div className="mb-6  gap-1 hidden md:flex">
          <p className="text-xm p-2 flex justify-center items-center bg-background-07 w-full">
            {sm}
          </p>
          <p className="text-xm p-2 flex justify-center items-center bg-background-07 w-full">
            {lg}
          </p>
        </div>

        {external && (
          <a
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block text-sm font-medium uppercase px-6 py-3 w-full text-background bg-foreground backdrop-blur-md text-center rounded-lg hover:opacity-90 hover:no-underline transition-opacity`}
          >
            View on Good Mood Prints
          </a>
        )}
      </div>

      {/* Mobile view */}
      <div className="block md:hidden fixed font-mono bottom-0 left-0 right-0 md:sticky md:top-8 max-h-screen">
        <div
          className={`py-8 px-6 transition-all duration-150 ${
            isCollapsed ? " bg-background/0" : "bg-background"
          }`}
        >
          <div
            className={`transition-all duration-150 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="text-md md:text-2xl mb-0 font-mono uppercase">
              {title}
            </h1>
            <p className="text-sm text-foreground/60 mb-4 md:mb-6">{date}</p>

            {description && (
              <p className="mb-4 md:mb-6 text-sm ">{description}</p>
            )}

            <div className="mb-6  gap-1 hidden md:flex">
              <p className="text-xm p-2 flex justify-center items-center bg-background-07 w-full">
                {sm}
              </p>
              <p className="text-xm p-2 flex justify-center items-center bg-background-07 w-full">
                {lg}
              </p>
            </div>
          </div>

          {external && (
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-6 py-3 text-sm font-medium uppercase w-full text-background backdrop-blur-md text-center rounded-lg hover:opacity-90 transition-opacity ${
                isCollapsed ? "bg-foreground/50" : "bg-foreground"
              }`}
            >
              View on Good Mood Prints
            </a>
          )}
        </div>
      </div>
    </>
  );
}
