"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import ImgPlaceholder from "@/components/ui/imgPlaceholder";
import type { Poster } from "@/lib/posters";
import { useNavigationStore } from "@/stores/useNavigationStore";

const PostersContent = ({ posters }: { posters: Poster[] }) => {
  const { selectedItemId, setSelectedItemId } = useNavigationStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const posterIds = useMemo(
    () => posters.map((p) => `posters-${p.slug}`),
    [posters],
  );

  const currentSelectedId =
    selectedItemId && posterIds.includes(selectedItemId)
      ? selectedItemId
      : posterIds[0] || null;

  useEffect(() => {
    // Columns as actually laid out (1 / 2 / 3 by breakpoint), read from the
    // grid itself so this never drifts from the Tailwind classes.
    const columnCount = () => {
      const grid = gridRef.current;
      if (!grid) return 1;
      return getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const count = posterIds.length;
      // fall back to the first poster when the stored selection is from
      // another page, so the first key press moves instead of re-selecting it
      const index = Math.max(0, posterIds.indexOf(currentSelectedId ?? ""));
      const cols = columnCount();
      const lastRow = Math.floor((count - 1) / cols);
      let next: number | null = null;

      if (e.key === "ArrowRight") next = (index + 1) % count;
      else if (e.key === "ArrowLeft") next = (index - 1 + count) % count;
      else if (e.key === "ArrowDown") {
        // the last row can be short: drop to its last poster rather than
        // stopping a row early
        if (Math.floor(index / cols) < lastRow) {
          next = Math.min(index + cols, count - 1);
        }
      } else if (e.key === "ArrowUp") {
        if (index - cols >= 0) next = index - cols;
      } else if (e.key === "Enter" && currentSelectedId) {
        e.preventDefault();
        const link = document
          .querySelector(`[data-item-id="${currentSelectedId}"]`)
          ?.getAttribute("href");
        if (link) {
          window.location.href = link;
        }
        return;
      } else {
        return;
      }

      // arrows never scroll the page here — the selection does that below
      e.preventDefault();
      if (next !== null) setSelectedItemId(posterIds[next]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedItemId, posterIds, currentSelectedId]);

  // Scroll selected item into view when it changes
  useEffect(() => {
    if (currentSelectedId) {
      const element = document.querySelector(
        `[data-item-id="${currentSelectedId}"]`,
      );
      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentSelectedId]);

  return (
    <section className="px-default mb-24">
      <h2 className="mb-8">Posters</h2>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {posters.map((poster) => {
          const itemId = `posters-${poster.slug}`;
          const isSelected = currentSelectedId === itemId;

          return (
            <Link
              key={poster.slug}
              href={`/posters/${poster.slug}`}
              data-item-id={itemId}
              onClick={() => setSelectedItemId(itemId)}
              className={`group px-2 pt-2 pb-6 ${isSelected ? "bg-foreground text-background" : ""}`}
            >
              <div className="relative aspect-[4/4] overflow-hidden mb-4">
                <ImgPlaceholder size="sm" />
                <Image
                  width={512}
                  height={512}
                  // grid is 1 / 2 / 3 columns inside the 960px layout
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                  src={`/posters/${poster.slug}/1-full.jpg`}
                  alt={poster.title}
                  className="relative object-cover z-10 w-full h-full group-hover:scale-105 transition-transform duration-(--duration-enter)"
                />
              </div>
              <h2 className="group-hover:underline font-semibold text-sm">
                {isSelected && <span className="px-2">{`>`}</span>}
                {poster.title}
                <span
                  className={`text-sm tabular-nums ${
                    isSelected ? "text-background/60" : "text-foreground/60"
                  }`}
                >
                  {`, ${poster.date}`}
                </span>
              </h2>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default PostersContent;
