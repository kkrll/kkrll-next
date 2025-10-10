import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import type { WritingMeta } from "@/lib/writings";
import type { ProjectMeta } from "@/lib/projects";
import type { PosterMeta } from "@/lib/posters";

type SelectedItemType = WritingMeta | ProjectMeta | PosterMeta;

const ContentWindow = ({
  selectedItem,
}: {
  selectedItem: SelectedItemType;
}) => {
  const [newValue, setNewValue] = useState(selectedItem);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastChangeRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    lastChangeRef.current = now;

    // Debounce: if navigating quickly, wait for pause
    if (timeSinceLastChange < 150) {
      // Wait 200ms to see if user stops navigating
      const debounceTimer = setTimeout(() => {
        setIsTransitioning(true);
        const transitionTimer = setTimeout(() => {
          setNewValue(selectedItem);
          setIsTransitioning(false);
        }, 200);
        return () => clearTimeout(transitionTimer);
      }, 200);

      return () => clearTimeout(debounceTimer);
    }

    // If enough time passed, update immediately with transition
    setIsTransitioning(true);
    const transitionTimer = setTimeout(() => {
      setNewValue(selectedItem);
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(transitionTimer);
  }, [selectedItem]);

  return (
    <div
      className={`sticky top-0 size-fit p-8 shadow-2xl w-full ${
        isTransitioning
          ? "animate-[fadeOut_200ms_ease-in-out]"
          : "animate-[fadeIn_200ms_ease-in-out]"
      }`}
    >
      <div className="mb-8">
        <h2 className="mb-4">{newValue.title}</h2>
        <p>{newValue.description}</p>
      </div>
      {newValue.cover && (
        <Image
          src={`/${newValue.type}/${newValue.slug}/${newValue.cover.replace(
            "./",
            ""
          )}`}
          width={512}
          height={512}
          alt={newValue.title}
          className="w-full rounded-lg mb-4"
        />
      )}
    </div>
  );
};

export default ContentWindow;
