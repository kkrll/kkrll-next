"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useNavigationStore } from "@/stores/useNavigationStore";
import type { Writing } from "@/lib/writings";

const WritingsContent = ({ writings }: { writings: Writing[] }) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const writingIds = useMemo(
    () => writings.map((w) => `writings-${w.slug}`),
    [writings]
  );

  const currentSelectedId =
    selectedItemId && writingIds.includes(selectedItemId)
      ? selectedItemId
      : writingIds[0] || null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectNext(writingIds);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectPrevious(writingIds);
      } else if (e.key === "Enter" && currentSelectedId) {
        e.preventDefault();
        const link = document
          .querySelector(`[data-item-id="${currentSelectedId}"]`)
          ?.getAttribute("href");
        if (link) {
          window.location.href = link;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNext, selectPrevious, writingIds, currentSelectedId]);

  // Scroll selected item into view when it changes
  useEffect(() => {
    if (currentSelectedId) {
      const element = document.querySelector(
        `[data-item-id="${currentSelectedId}"]`
      );
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentSelectedId]);

  return (
    <section className="px-default mb-24">
      <h2 className="mb-8">Writings</h2>
      <div>
        {writings.map((writing) => {
          const itemId = `writings-${writing.slug}`;
          const isSelected = currentSelectedId === itemId;

          return (
            <article key={writing.slug} className="mb-4">
              <Link
                href={`/writings/${writing.slug}`}
                data-item-id={itemId}
                onClick={() => setSelectedItemId(itemId)}
                className={`group flex pr-2 py-2 items-baseline ${isSelected ? "bg-foreground text-background" : "bg-none"
                  }`}
              >
                <div className="flex items-baseline">
                  <h3 className="text-base group-hover:underline">
                    {isSelected && <span className="px-2">{`>`}</span>}
                    {writing.title}
                  </h3>
                  {writing.publisher && (
                    <p className={`text-sm hidden md:block ${isSelected ? "text-background-07" : "text-foreground-07"
                      }`}>
                      {" , "}
                      <span className="italic">{writing.publisher}</span>
                    </p>
                  )}
                </div>
                <span className={`flex-1 border-b-2 border-dotted mx-2 mb-2 ${isSelected ? "border-background/20" : "border-foreground/20"
                  }`} />
                <time className={`text-sm  flex-shrink-0 ${isSelected ? "text-background/60" : "text-foreground/60"
                  }`}>
                  {new Date(writing.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default WritingsContent;
