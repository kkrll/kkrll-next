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

const ProjectView = ({ project }: { project: ProjectMeta }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4">{project.title}</h2>
        <p>{project.description}</p>
      </div>
      {project.images && project.images.length > 0 && (
        <Carousel
          carouselName={project.slug}
          options={carouselOptions}
          nbSlides={project.images.length}
        >
          {project.images.map((image, index) => {
            return (
              <div key={image} className="embla__slide">
                <div className="relative overflow-hidden w-full min-h-[240px]">
                  <ImgPlaceholder />
                  <Image
                    src={image}
                    width={800}
                    height={0}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="relative w-full h-auto z-10 object-contain"
                  />
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
