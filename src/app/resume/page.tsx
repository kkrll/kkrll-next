import Divider from "@/components/Divider";
import PageLayout from "@/components/PageLayout";

import jobsList, { JobsType } from "@/components/resume/jobsList";

const WorkItem = ({ job }: { job: JobsType }) => {
  const { dates, role, company, companyLink, description, details, tags } = job;

  return (
    <>
      <Divider />
      <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] py-16">
        <div className="flex flex-col gap-4 px-6 md:px-4 sticky top-16 self-start">
          <div>
            <a href={companyLink} target="_blank" rel="noreferrer">
              <h1 className="uppercase font-mono">{company}</h1>
            </a>
            <p className="font-mono text-foreground-07 text-sm mb-4">{role}</p>
            <p className="font-mono text-foreground-07 text-sm">{dates}</p>
          </div>
        </div>
        <div className="">
          <p className="max-w-[512px] mb-6">{description}</p>
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
      <section className="px-6 md:px-4 min-h-[60vh] flex flex-col justify-center">
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
