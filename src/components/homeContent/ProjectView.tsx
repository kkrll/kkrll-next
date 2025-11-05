"use client";

import Image from "next/image";
import Carousel from "../ui/carousel";
import ImgPlaceholder from "../ui/imgPlaceholder";

import type { ProjectMeta } from "@/lib/projects";
import type { EmblaOptionsType } from "embla-carousel";

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
  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4">{project.title}</h2>
        <p>{project.description}</p>
      </div>
      {project.media && project.media.length === 1 && (
        <div className="relative overflow-hidden w-full min-h-[240px]">
          <ImgPlaceholder />
          <MediaItem src={project.media[0]} title={project.title} />
        </div>
      )}
      {project.media && project.media.length > 1 && (
        <Carousel
          carouselName={project.slug}
          options={carouselOptions}
          nbSlides={project.media.length}
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
