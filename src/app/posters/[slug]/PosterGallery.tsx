"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { useZoomThumbs } from "@/components/ui/lightbox";
import { useTracking } from "@/hooks/useTracking";
import { cn } from "@/lib/utils";

export default function PosterGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const { track } = useTracking();
  const { getThumb, register, trigger, enabled } = useZoomThumbs();
  const [zoomed, setZoomed] = useState<number | null>(null);

  const items = images.map((src, index) => ({
    src,
    alt: `${title} - image ${index + 1}`,
  }));

  return (
    <div className="rounded-4xl overflow-hidden space-y-1 px-default ">
      {items.map((item, index) => (
        <Image
          key={item.src}
          ref={register(item.src)}
          width={800}
          height={0}
          // 2/3 of the 960px layout on desktop, full width on mobile
          sizes="(min-width: 960px) 640px, (min-width: 768px) 67vw, 100vw"
          src={item.src}
          alt={item.alt}
          className={cn("w-full", enabled && "cursor-zoom-in")}
          {...trigger(() => {
            track("zoom media", {
              page: "poster",
              kind: "image",
              poster: title,
              image: index + 1,
            });
            setZoomed(index);
          })}
        />
      ))}
      {zoomed !== null && (
        <Lightbox
          items={items}
          index={zoomed}
          onIndexChange={setZoomed}
          onClose={() => setZoomed(null)}
          getThumb={getThumb}
        />
      )}
    </div>
  );
}
