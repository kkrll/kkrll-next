import PageLayout from "@/components/PageLayout";
import { getAllPosters } from "@/lib/posters";
import Image from "next/image";
import Link from "next/link";

export default function PostersPage() {
  const posters = getAllPosters();

  return (
    <PageLayout>
      <section className="px-8 md:px-4 mb-24">
        <h2 className="mb-8">Posters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((poster) => (
            <Link
              key={poster.slug}
              href={`/posters/${poster.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/4] overflow-hidden rounded-lg mb-4">
                <Image
                  width={512}
                  height={512}
                  src={`/posters/${poster.slug}/1-full.jpg`}
                  alt={poster.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="group-hover:underline">{poster.title}</h2>
              <p className="text-sm text-foreground/60">{poster.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
