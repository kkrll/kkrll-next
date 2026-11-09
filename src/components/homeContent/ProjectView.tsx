"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTracking } from "@/hooks/useTracking";
import type { ProjectMeta } from "@/lib/projects";
import { cn } from "@/lib/utils";
import Carousel from "../ui/carousel";
import { LinkIcon } from "../ui/icons";
import ImgPlaceholder from "../ui/imgPlaceholder";
import Lightbox, { type LightboxItem, useZoomThumbs } from "../ui/lightbox";

const isVideo = (src: string) => /\.(mp4|webm|mov|avi)$/i.test(src);

// Images and videos both zoom. The carousel and the zoom share one index,
// so closing the zoom lands on whatever you stepped to.
const ProjectMedia = ({ media, title }: { media: string[]; title: string }) => {
  const { track } = useTracking();
  const { getThumb, register, trigger, enabled } = useZoomThumbs();
  const [slide, setSlide] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  const items = useMemo(
    () =>
      media.map(
        (src): LightboxItem =>
          isVideo(src)
            ? { src, alt: `${title} - Video`, kind: "video" }
            : { src, alt: `${title} - Image`, kind: "image" },
      ),
    [media, title],
  );

  const zoomProps = (index: number) => ({
    ref: register(items[index].src),
    className: cn(
      "relative w-full h-auto z-10 object-contain",
      enabled && "cursor-zoom-in",
    ),
    ...trigger(() => {
      track("zoom media", {
        page: "home",
        project: title,
        kind: items[index].kind,
      });
      setZoomed(index);
    }),
  });

  return (
    <>
      <Carousel index={slide} onIndexChange={setSlide} buttonsPosition="top">
        {items.map((item, index) => (
          <div
            key={item.src}
            className="relative overflow-hidden w-full min-h-[240px]"
          >
            <ImgPlaceholder className="pt-16" />
            {item.kind === "video" ? (
              <video
                src={item.src}
                aria-label={item.alt}
                autoPlay
                loop
                muted
                playsInline
                {...zoomProps(index)}
              />
            ) : (
              <Image
                src={item.src}
                width={800}
                height={0}
                // rendered w-full in the content column (~45–57vw on desktop) — without
                // sizes, srcset is only 1x=828w/2x=1920w and wide 1x screens upscale
                sizes="(min-width: 768px) 60vw, 100vw"
                alt={item.alt}
                {...zoomProps(index)}
              />
            )}
          </div>
        ))}
      </Carousel>
      {zoomed !== null && (
        <Lightbox
          items={items}
          index={zoomed}
          onIndexChange={(i) => {
            setZoomed(i);
            setSlide(i);
          }}
          onClose={() => setZoomed(null)}
          getThumb={getThumb}
        />
      )}
    </>
  );
};

// `inline` is the phone version, expanded under its list item: the item
// already carries the title and opens the project, so only the body shows.
const ProjectView = ({
  project,
  inline,
}: {
  project: ProjectMeta;
  inline?: boolean;
}) => {
  const { track } = useTracking();
  return (
    <>
      <div className={inline ? "mb-6" : "mb-8"}>
        {!inline && (
          <div className="flex pb-4 lg:pb-8 mb-6 border-b border-background-07 justify-between items-center">
            <h2>{project.title}</h2>
            <a
              href={project.link}
              onClick={() =>
                track("open project", { page: "home", project: project.title })
              }
              className="flex font-mono text-sm uppercase gap-2 justify-center items-center w-32 py-2.5 px-4 rounded-2xl transition-colors duration-(--duration-micro) ease-micro bg-background-07 hover:bg-background-05 no-underline cursor-pointer"
            >
              {project.isExternal ? (
                <>
                  Visit <LinkIcon />
                </>
              ) : (
                "View more"
              )}
            </a>
          </div>
        )}
        <p className="max-w-2xl  text-pretty">{project.description}</p>
      </div>
      {project.media && (
        <ProjectMedia
          // new project, fresh carousel at slide 1
          key={project.slug}
          media={project.media}
          title={project.title}
        />
      )}
    </>
  );
};

export default ProjectView;
