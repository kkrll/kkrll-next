import { getWritingBySlug, getAllWritings } from "@/lib/writings";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

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
    <PageLayout>
      <article className="max-w-[560px]">
        <header className="mb-8 border-b border-foreground pb-6">
          {writing.cover && (
            <Image
              src={`/writings/${params.slug}/${writing.cover.replace(
                "./",
                ""
              )}`}
              alt={writing.title}
              width={800}
              height={400}
              className="w-full rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl mb-4">{writing.title}</h1>
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
              p: ({ children }) => (
                <p className="my-4 font-serif text-lg font-regular dark:font-medium leading-relaxed [figcaption_&]:mt-0 [figcaption_&]:text-foreground-07 [figcaption_&]:mb-10 [figcaption_&]:font-sans [figcaption_&]:text-xs [figcaption_&]:font-normal [figcaption_&]:leading-normal">
                  {children}
                </p>
              ),
              img: (props) => {
                // Rewrite relative paths (./image.png) to absolute paths (/writings/slug/image.png)
                const src = props.src?.startsWith("./")
                  ? `/writings/${params.slug}/${props.src.replace("./", "")}`
                  : props.src;

                return (
                  <Image
                    {...props}
                    src={src}
                    width={800}
                    height={0}
                    className="rounded-lg my-6"
                    alt={props.alt || ""}
                  />
                );
              },
            }}
          />
        </div>
      </article>
    </PageLayout>
  );
}
