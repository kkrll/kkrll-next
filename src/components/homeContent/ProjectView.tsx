"use client";

import Image from "next/image";
import Carousel from "../ui/carousel";
import ImgPlaceholder from "../ui/imgPlaceholder";

import type { ProjectMeta } from "@/lib/projects";
import type { EmblaOptionsType } from "embla-carousel";
import { LinkIcon } from "../ui/icons";
import { useTracking } from "@/hooks/useTracking";

const carouselOptions: EmblaOptionsType = {
  loop: true,
  align: "center",
  containScroll: "trimSnaps",
  startIndex: 0,
};

const MediaItem = ({ src, title }: { src: string; title: string }) => {

  const isVideo = (src: string): boolean => {
    return /\.(mp4|webm|mov|avi)$/i.test(src);
  };

  if (isVideo(src))
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="relative w-full h-auto z-10 object-contain"
      />
    );
  return (
    <Image
      src={src}
      width={800}
      height={0}
      alt={`${title} - Image`}
      className="relative w-full h-auto z-10 object-contain"
    />
  );
};

const ProjectView = ({ project }: { project: ProjectMeta }) => {
  const { track } = useTracking()
  return (
    <>
      <div className="mb-8">
        <div className="flex pb-4 mb-6 border-b border-background-07 justify-between items-center">
          <h2>{project.title}</h2>
          <a
            href={project.link} onClick={() => track("open project", { page: "home", project: project.title })}
            className="flex font-mono text-sm uppercase gap-2 justify-center items-center w-32 py-2 px-4 rounded-2xl transition-colors duration-100 ease-in bg-background-07 hover:bg-background-05 no-underline cursor-pointer"
          >
            {project.isExternal ? <>Visit <LinkIcon /></> : "View more"}
          </a>
        </div>
        <p>{project.description}</p>
      </div>
      {project.media && (
        <Carousel
          carouselName={project.slug}
          options={carouselOptions}
          nbSlides={project.media.length}
          buttonsPosition="top"
        >
          {project.media.map((mediaItem) => {
            return (
              <div key={mediaItem} className="embla__slide">
                <div className="relative overflow-hidden w-full min-h-[240px]">
                  <ImgPlaceholder />
                  <MediaItem src={mediaItem} title={project.title} />
                </div>
              </div>
            );
          })}
        </Carousel>
      )}
    </>
  );
};

export default ProjectView;
