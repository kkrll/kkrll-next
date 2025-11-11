"use client";

import { flushSync } from "react-dom";
import { useThemeStore } from "@/stores/useThemeStore";
import { useRef, useEffect } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const cxAnimRef = useRef<SVGAnimateElement>(null);
  const cyAnimRef = useRef<SVGAnimateElement>(null);
  const rAnimRef = useRef<SVGAnimateElement>(null);
  const rAnimRef2 = useRef<SVGAnimateElement>(null);
  const rAnimRefStrokes = useRef<SVGAnimateElement>(null);
  const prevThemeRef = useRef(theme);

  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      cxAnimRef.current?.beginElement();
      cyAnimRef.current?.beginElement();
      rAnimRef.current?.beginElement();
      rAnimRef2.current?.beginElement();
      rAnimRefStrokes.current?.beginElement();

      prevThemeRef.current = theme;
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      });
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="text-foreground cursor-pointer p-2 h-9"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width={16}
        height={16}
        aria-hidden="true"
      >
        <title>Theme toggle icon</title>
        <defs>
          <mask id="moon-mask">
            <circle
              fill="none"
              stroke="white"
              strokeDasharray={"1 8 1 8"}
              strokeWidth={3}
              strokeLinecap="round"
              cx="12"
              cy="12"
              r={theme === "dark" ? "0" : "10"}
            >
              <animate
                ref={rAnimRefStrokes}
                attributeName="r"
                begin="indefinite"
                keySplines=".4 0 .55 .99"
                dur="0.3s"
                fill="freeze"
                from={theme === "dark" ? "10" : "0"}
                to={theme === "dark" ? "0" : "10"}
              />
            </circle>
            <circle
              fill="white"
              cx="12"
              cy="12"
              r={theme === "dark" ? "10" : "4"}
            >
              <animate
                ref={rAnimRef2}
                attributeName="r"
                begin="indefinite"
                keySplines=".4 0 .55 .99"
                dur="0.3s"
                fill="freeze"
                from={theme === "dark" ? "4" : "10"}
                to={theme === "dark" ? "10" : "4"}
              />
            </circle>
            <circle
              cx={theme === "dark" ? "17" : "40"}
              cy={theme === "dark" ? "10" : "14"}
              r={theme === "dark" ? "10" : "14"}
              fill="black"
              opacity={0.9}
            >
              <animate
                ref={cxAnimRef}
                attributeName="cx"
                begin="indefinite"
                keySplines=".4 0 .55 .99"
                dur="0.3s"
                fill="freeze"
                from={theme === "dark" ? "40" : "17"}
                to={theme === "dark" ? "17" : "40"}
              />
              <animate
                ref={cyAnimRef}
                attributeName="cy"
                begin="indefinite"
                keySplines=".4 0 .55 .99"
                dur="0.3s"
                fill="freeze"
                from={theme === "dark" ? "14" : "10"}
                to={theme === "dark" ? "10" : "14"}
              />
              <animate
                ref={rAnimRef}
                attributeName="r"
                begin="indefinite"
                keySplines=".4 0 .55 .99"
                dur="0.3s"
                fill="freeze"
                from={theme === "dark" ? "14" : "10"}
                to={theme === "dark" ? "10" : "14"}
              />
            </circle>
          </mask>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="14"
          fill="currentColor"
          mask="url(#moon-mask)"
        />
      </svg>
    </button>
  );
}
