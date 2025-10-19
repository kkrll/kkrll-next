import HomeContent from "@/components/homeContent";
import Bio from "@/components/Bio";

import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";
import PageLayout from "@/components/PageLayout";
import { getAllWorksMeta } from "@/lib/work";

export default async function Home() {
  const writings = getAllWritingsMeta(4);
  const projects = getAllProjectsMeta(4);
  const work = getAllWorksMeta(3);

  return (
    <PageLayout>
      <Bio />
      <HomeContent projects={projects} writings={writings} work={work} />
    </PageLayout>
  );
}
