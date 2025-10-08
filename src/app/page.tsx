import Header from "@/components/header";
import HomeContent from "@/components/homeContent";

import { getAllPostersMeta } from "@/lib/posters";
import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";
import Bio from "@/components/Bio";

export default async function Home() {
  const writings = getAllWritingsMeta();
  const projects = getAllProjectsMeta();
  const posters = getAllPostersMeta();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between  max-w-[1200px] mx-auto">
      <Header />
      <Bio />
      <HomeContent projects={projects} writings={writings} posters={posters} />
    </main>
  );
}
