import Divider from "@/components/Divider";
import PageLayout from "@/components/PageLayout";

import jobsList, { JobsType } from "@/components/resume/jobsList";
import Carousel from "@/components/ui/carousel";
import { getR2Url } from "@/lib/constants";
import type { EmblaOptionsType } from "embla-carousel";

const carouselOptions: EmblaOptionsType = {
  loop: true,
  align: "center",
  containScroll: "trimSnaps",
  startIndex: 0,
};

const WorkItem = ({ job }: { job: JobsType }) => {
  const { dates, role, company, companyLink, description, projects } = job;

  return (
    <>
      <Divider />
      <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] py-16">
        <div className="flex flex-col gap-4 mb-8 px-default md:sticky top-16 self-start">
          <div>
            <a href={companyLink} target="_blank" rel="noreferrer">
              <h1 className="uppercase font-mono">{company}</h1>
            </a>
            <p className="font-mono text-foreground-07 text-sm mb-4">{role}</p>
            <p className="font-mono text-foreground-07 text-sm">{dates}</p>
          </div>
        </div>
        <div className="px-default flex md:flex-col gap-12">
          <p className="max-w-[512px]">{description}</p>
          {projects && (
            <Carousel
              nbSlides={projects.length}
              options={carouselOptions}
              carouselName={company + "projects"}
            >
              {projects.map((project, index) => {
                if (project.type === "video" && project.file) {
                  return (
                    <div key={project.name} className="flex gap-8 embla__slide">
                      <video
                        src={getR2Url(project.file)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="relative max-h-[480px] rounded-4xl "
                      />
                      <div className="flex flex-col h-full justify-end gap-4">
                        <h3 className="font-mono uppercase">{project.name}</h3>
                        <p>{project.description}</p></div>
                    </div>
                  );
                }
              }
              )}
            </Carousel>)}
          {/* <ul className="list-disc list-inside">
            {details.map((detail, index) => (
              <li key={index} className="mb-2">
                {detail}
              </li>
            ))}
          </ul> */}
        </div>
      </section>
    </>
  );
};

const Resume = () => {
  const experience = new Date().getFullYear() - 2016;
  return (
    <PageLayout>
      <section className="px-default min-h-[60vh] flex flex-col justify-center">
        <h1 className="uppercase font-mono mb-6">Resume</h1>
        <p className="max-w-[512px]">
          Designer with {experience} years of experience in diverse
          environments, including early-stage startups and established companies
          in B2B and B2C models.
        </p>
      </section>
      {jobsList.map((job) => (
        <WorkItem key={job.company} job={job} />
      ))}
    </PageLayout>
  );
};

export default Resume;
