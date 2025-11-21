import { ReactNode } from "react";
import Image from "next/image";

export const IntroPoint = ({
  title = "",
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  return (
    <div className="grid-1-to-3 items-baseline">
      <div>
        <h3 className="text-secondary w-full mb-2 md:text-right">{title}</h3>
      </div>
      <div className="max-w-[560px]">{children}</div>
    </div>
  );
};

export const Section = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return <section className={`py-12 w-full ${className}`}>{children}</section>;
};

export const Illustration = ({
  src,
  caption,
  hideCaption = false,
}: {
  src: string;
  caption: string;
  hideCaption?: boolean;
}) => {
  return (
    <div className="max-w-[640px] mb-6">
      <Image src={src} alt={caption} width={720} height={0} />
      {!hideCaption && <figcaption>{caption}</figcaption>}
    </div>
  );
};

export const SectionContent = ({
  sidebar,
  children,
}: {
  sidebar?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="grid-1-to-3">
      <div>{sidebar}</div>
      <div>{children}</div>
    </div>
  );
};
