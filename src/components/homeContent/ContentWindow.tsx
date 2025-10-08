import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setNewValue(selectedItem);
      setIsTransitioning(false);
    }, 300); // Match your fade-out duration
    return () => clearTimeout(timer);
  }, [selectedItem]);

  return (
    <div
      className={`sticky top-0 size-fit p-8 shadow-2xl w-full ${
        isTransitioning
          ? "animate-[fadeOut_300ms_ease-in-out]"
          : "animate-[fadeIn_300ms_ease-in-out]"
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
