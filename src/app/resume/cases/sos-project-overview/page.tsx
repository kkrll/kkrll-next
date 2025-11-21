import PageLayout from "@/components/PageLayout"
import Background from "@/components/resume/SosProjectOverView.tsx/Background"
import HeroIllustration from "@/components/resume/SosProjectOverView.tsx/HeroIllustration"
import Intro from "@/components/resume/SosProjectOverView.tsx/Intro"
import ProfessionalCards from "@/components/resume/SosProjectOverView.tsx/ProfessionalCards"

const ProjectOverViewPage = () => {
  return (
    <PageLayout className="font-serif [&_section_p]:max-w-[512px] [&_section_p]:leading-[1.6]">
      <HeroIllustration />
      <Intro />
      <Background />
      <ProfessionalCards />
    </PageLayout>
  )
}

export default ProjectOverViewPage
