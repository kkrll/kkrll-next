import PageLayout from "@/components/PageLayout";
import ArchitectureTransformations from "@/components/resume/SosProjectOverView.tsx/ArchitectureTransformations";
import Background from "@/components/resume/SosProjectOverView.tsx/Background";
import HeroIllustration from "@/components/resume/SosProjectOverView.tsx/HeroIllustration";
import Intro from "@/components/resume/SosProjectOverView.tsx/Intro";
import OpenSupply from "@/components/resume/SosProjectOverView.tsx/OpenSupply";
import ProfessionalCards from "@/components/resume/SosProjectOverView.tsx/ProfessionalCards";
import Results from "@/components/resume/SosProjectOverView.tsx/Results";
import Link from "next/link";

const ProjectOverViewPage = () => {
  return (
    <PageLayout className="font-serif [&_section_p]:max-w-[560px] [&_section_p]:leading-[1.6] px-default">
      <HeroIllustration />
      <Intro />
      <Background />
      <ProfessionalCards />
      <ArchitectureTransformations />
      <OpenSupply />
      <Results />
      <p>Thank you.</p>
      <Link href="/resume">Return to resume</Link>
    </PageLayout>
  );
};

export default ProjectOverViewPage;
