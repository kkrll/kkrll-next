import Image from "next/image";
import type { ProjectMeta } from "@/lib/projects";
import Carousel from "../ui/carousel";

const ProjectView = ({
  project,
  isTransitioning,
}: {
  project: ProjectMeta;
  isTransitioning: boolean;
}) => {
  return (
    <div
      className={`sticky top-0 size-fit p-8 shadow-2xl w-full ${
        isTransitioning
          ? "animate-[fadeOut_200ms_ease-in-out]"
          : "animate-[fadeIn_200ms_ease-in-out]"
      }`}
    >
      <div className="mb-8">
        <h2 className="mb-4">{project.title}</h2>
        <p>{project.description}</p>
      </div>
      {project.images && project.images.length > 0 && (
        // <Carousel>
        //   <CarouselContent>
        <div>
          <Carousel
            options={{
              loop: true,
              align: "center",
              containScroll: "trimSnaps",
              startIndex: 0,
            }}
            nbSlides={project.images.length}
          >
            {project.images.map((image, index) => (
              <Image
                key={image}
                src={image}
                width={512}
                height={512}
                alt={`${project.title} - Image ${index + 1}`}
                className="w-full"
              />
            ))}
          </Carousel>
        </div>
        // </CarouselContent>
        // <CarouselPrevious />
        // <CarouselNext />
        // </Carousel>
      )}
    </div>
  );
};

export default ProjectView;
