import { getAllWritings } from "@/lib/writings";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <PageLayout>
      <section className="px-default mb-24">
        <h2 className="mb-8">Writings</h2>
        <div>
          {writings.map((writing) => (
            <article key={writing.slug} className=" pb-6">
              <Link
                href={`/writings/${writing.slug}`}
                className="group flex items-baseline"
              >
                <div className="flex items-baseline">
                  <h3 className="mb-2 text-base group-hover:underline">
                    {writing.title}
                  </h3>
                  {writing.publisher && (
                    <p className="text-sm mt-2 text-foreground-07 hidden md:block">
                      {" , "}
                      <span className="italic">{writing.publisher}</span>
                    </p>
                  )}
                </div>
                <span className="flex-1 border-b-2 border-dotted border-foreground/20 mx-2 mb-2" />
                <time className="text-sm text-foreground/60 flex-shrink-0">
                  {new Date(writing.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </section>
      {""}
    </PageLayout>
  );
}
