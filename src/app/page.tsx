import BioContent from "@/components/BioContent";
import HomeContent from "@/components/homeContent";
import PageLayout from "@/components/PageLayout";
import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";

export default async function Home() {
  const writings = getAllWritingsMeta(5);
  const projects = getAllProjectsMeta(5);

  return (
    <PageLayout>
      <div className="absolute z-[5] left-0 right-0 top-0 h-16 bg-gradient-to-b from-background to-transparent opacity-80" />
      <BioContent />
      <HomeContent projects={projects} writings={writings} />
    </PageLayout>
  );
}
