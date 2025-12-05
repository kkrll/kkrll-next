import Image from "next/image";
import { Illustration, Section } from "./structural";

const Background = () => {
  return (
    <Section className="grid-1-to-3">
      <div />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-normal font-serif mt-10 mb-2">
          Background
        </h2>
        <Illustration
          src={"/img/resume/sos-project-overview/initial-state.png"}
          caption={
            "Project overview page placed on simplified version of a Customer Journey Map"
          }
        />
        <p>
          StarOfService is a platform connecting clients with skilled
          professionals for various service needs. The Project Overview page
          plays a critical role in this journey, as it's where clients encounter
          potential matches for their requests. It functioned adequately, but
          usability tests and metrics performance highlighted the optimisation
          needed to maximise client engagement.
        </p>
        <p>
          Within the Growth Track, I led the redesign of the Project Overview
          page to enhance user experience and increase client engagement with
          professionals.
        </p>
        <p>
          This case study details key initiatives to illustrate the approach:
        </p>
        anchor list to be added...
      </div>
    </Section>
  );
};

export default Background;
