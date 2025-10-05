import Header from "@/components/header";
import HomeContent from "@/components/homeContent";
import { getAllProjectsMeta } from "@/lib/projects";
import { getAllWritingsMeta } from "@/lib/writings";

export default async function Home() {
  const writings = getAllWritingsMeta();
  const projects = getAllProjectsMeta();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between  max-w-[1200px] mx-auto">
      <Header />
      <section className="min-h-[70vh] pt-[30vh]">
        <p>Hey. </p>
        <p>I'm Kiryl, a product designer at Zing Coach. </p>
        <p>
          You can find here some of my posters, articles, resume, and something
          else, occasionally.
        </p>
        <p>Welcome.</p>
      </section>
      <HomeContent projects={projects} writings={writings} />
    </main>
  );
}
