import { getAllWritings } from "@/lib/writings";
import Link from "next/link";

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <main>
      <section>
        <h1>Writings</h1>
        <div>
          {writings.map((writing) => (
            <article
              key={writing.slug}
              className="border-b border-foreground pb-6"
            >
              <Link href={`/writings/${writing.slug}`} className="group">
                <h2 className="text-2xl font-bold mb-2 group-hover:underline">
                  {writing.title}
                </h2>
                <time className="text-sm text-foreground/60">
                  {new Date(writing.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {writing.publisher && (
                  <p className="text-sm mt-2">
                    Published on:{" "}
                    <span className="italic">{writing.publisher}</span>
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </section>
      {""}
    </main>
  );
}
