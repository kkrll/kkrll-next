import HomeContent from "@/components/homeContent";
import Bio from "@/components/Bio";

import { getAllPostersMeta } from "@/lib/posters";
import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";
import PageLayout from "@/components/PageLayout";

export default async function Home() {
  const writings = getAllWritingsMeta(4);
  const projects = getAllProjectsMeta(4);
  const posters = getAllPostersMeta(4);

  return (
    <PageLayout>
      <Bio />
      <HomeContent projects={projects} writings={writings} posters={posters} />
    </PageLayout>
  );
}
