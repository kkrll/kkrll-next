import { getWritingBySlug, getAllWritings } from "@/lib/writings";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";

// Generate static paths for all writings at build time
export async function generateStaticParams() {
  const writings = getAllWritings();

  return writings.map((writing) => ({
    slug: writing.slug,
  }));
}

export default function WritingPage({ params }: { params: { slug: string } }) {
  const writing = getWritingBySlug(params.slug);

  if (!writing) {
    notFound();
  }

  return (
    <main className="max-w-[960px] mx-auto p-8">
      <article>
        <header className="mb-8 border-b border-foreground pb-6">
          <h1 className="text-4xl font-bold mb-4">{writing.title}</h1>
          <time className="text-sm text-foreground/60">
            {new Date(writing.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {writing.publisher && writing.link && (
            <p className="text-sm mt-2">
              Originally published on{" "}
              <a
                href={writing.link}
                target="_blank"
                rel="noopener noreferrer"
                className="italic underline hover:no-underline"
              >
                {writing.publisher}
              </a>
            </p>
          )}
        </header>

        <div className="prose prose-invert max-w-none">
          <MDXRemote
            source={writing.content}
            components={{
              Link,
              Image,
              a: (props) => (
                <a
                  {...props}
                  className="underline
  hover:no-underline"
                />
              ),
              img: (props) => {
                // Rewrite relative paths (./image.png) to absolute paths (/writings/slug/image.png)
                const src = props.src?.startsWith("./")
                  ? `/writings/${params.slug}/${props.src.replace("./", "")}`
                  : props.src;

                return (
                  <img
                    {...props}
                    src={src}
                    className="rounded-lg my-6"
                    alt={props.alt || ""}
                  />
                );
              },
            }}
          />
        </div>
      </article>
    </main>
  );
}
