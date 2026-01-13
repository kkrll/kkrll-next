"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavigationStore } from "@/stores/useNavigationStore";
import ImgPlaceholder from "@/components/ui/imgPlaceholder";
import type { Poster } from "@/lib/posters";

const PostersContent = ({ posters }: { posters: Poster[] }) => {
  const { selectedItemId, setSelectedItemId, selectNext, selectPrevious } =
    useNavigationStore();

  const posterIds = useMemo(
    () => posters.map((p) => `posters-${p.slug}`),
    [posters]
  );

  const currentSelectedId =
    selectedItemId && posterIds.includes(selectedItemId)
      ? selectedItemId
      : posterIds[0] || null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        selectNext(posterIds);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectPrevious(posterIds);
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
  }, [selectNext, selectPrevious, posterIds, currentSelectedId]);

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
      <h2 className="mb-8">Posters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  src={`/posters/${poster.slug}/1-full.jpg`}
                  alt={poster.title}
                  className="relative object-cover z-10 w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="group-hover:underline font-semibold text-sm">
                {isSelected && <span className="px-2">{`>`}</span>}
                {poster.title}
                <span className={`text-sm ${isSelected ? "text-background/60" : "text-foreground/60"
                  }`}>
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
