"use client";

import Link from "next/link";
import Image from "next/image";

interface PosterPreviewProps {
  poster: {
    slug: string;
    title: string;
    cover: string;
  };
  small?: boolean;
}

const PosterLink = ({
  url,
  onClick,
  children,
}: {
  url: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    href={url}
    onClick={onClick}
    className="flex flex-col flex-none pt-4  w-full h-full bg-background-secondary no-underline cursor-pointer"
  >
    {children}
  </Link>
);

const PosterHeader = ({ small }: { small: boolean }) => (
  <div className="h-[512px] ">
    <div className="bg-black rounded-sm h-4  md:w-[420px]" />
    <div
      className={`h-[512px] overflow-hidden ${
        small ? "w-[320px]" : "w-[512px]"
      }`}
    >
      <div
        className={`bg-[radial-gradient(circle,rgba(34,38,46,1)_0%,rgba(34,38,46,0)_45%)] transform -translate-y-1/2 md:w-screen ${
          small ? "h-640 max-w-320" : "h-[512px] max-w-[420px]"
        }`}
      />
    </div>
  </div>
);

const PosterImage = ({
  cover,
  title,
  small,
}: {
  cover: string;
  title: string;
  small: boolean;
}) => (
  <div
    className={`mx-24 absolute  top-54 h-full mb-64 border-t-2 border-background-07  md:mx-0 ${
      small ? "w-[320px]" : "w-[420px]"
    }`}
  >
    <div className="bg-gradient-to-b from-[#666] to-black border-[14px_16px_16px_16px] border-solid border-black box-border md:mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={cover}
        alt={title}
        width={512}
        height={512}
        className="w-full h-auto"
      />
    </div>
  </div>
);

const PosterPreview: React.FC<PosterPreviewProps> = ({
  poster,
  small = false,
}) => {
  const handleClick = () => {
    // Track with PostHog if needed
    console.log("Poster clicked:", poster.slug);
  };

  return (
    <PosterLink url={`/posters/${poster.slug}`} onClick={handleClick}>
      <PosterHeader small={false} />
      <PosterImage cover={poster.cover} title={poster.title} small={small} />
    </PosterLink>
  );
};

export default PosterPreview;
