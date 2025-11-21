"use client";

import { useState } from "react";
import {
  Illustration,
  IntroPoint,
  Section,
  SectionContent,
} from "./structural";
import { useModalState } from "@/components/ui/modal";
import Image from "next/image";
import ResearchModal from "./ResearchModal";

const CardsGallery = () => {
  const [active, setActive] = useState<0 | 1 | 2>(0);

  const cards = [
    "/img/resume/sos-project-overview/cards_2.png",
    "/img/resume/sos-project-overview/cards_3.png",
    "/img/resume/sos-project-overview/cards_4.png",
  ];

  const getTranslateValue = (reversed = false) => {
    if (reversed) {
      switch (active) {
        case 0:
          return "-translate-y-full";
        case 1:
          return "translate-y-0";
        case 2:
          return "translate-y-full";
        default:
          return "translate-y-0";
      }
    } else {
      switch (active) {
        case 0:
          return "translate-y-full";
        case 1:
          return "translate-y-0";
        case 2:
          return "-translate-y-full";
        default:
          return "translate-y-0";
      }
    }
  };

  const getActiveRadius = () => {
    switch (active) {
      case 0:
        return "rounded-tr-2xl rounded-br-2xl rounded-bl-2xl";
      case 1:
        return "rounded-2xl";
      case 2:
        return "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl";
      default:
        return "rounded-2xl";
    }
  };

  return (
    <div className="grid grid-cols-[25%_75%]">
      {/* Left column - Thumbnails */}
      <div className="grid grid-rows-3 relative">
        {cards.map((card, index) => (
          <button
            type="button"
            key={card}
            onClick={() => setActive(index as 0 | 1 | 2)}
            className={`
              relative p-2 m-2 rounded-2xl overflow-hidden z-10
              transition-all duration-200 ease-in-out
              ${index === active
                ? ""
                : "opacity-50 hover:opacity-100 cursor-pointer"
              }
            `}
          >
            <div className="relative w-full h-full">
              <Image
                src={card}
                alt={`Card variation ${index + 1}`}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </button>
        ))}

        <div
          className={`
            absolute top-0 left-0 w-full h-1/3
            bg-[#141919] rounded-l-3xl
            transition-transform duration-300 ease-in-out
            z-0
            ${getTranslateValue(true)}
          `}
          style={{ top: "33.333%" }}
        />
      </div>

      <div className="relative w-full max-w-[640px]">
        <div
          className={`
        relative overflow-hidden w-full
        transition-all duration-500 ease-in-out
        ${getActiveRadius()}
      `}
          style={{ paddingTop: "100%" }}
        >
          {cards.map((card, index) => (
            <div
              key={card}
              className={`absolute left-0 w-full h-full transition-transform duration-500 ease-in-out
            ${getTranslateValue()}`}
              style={{
                top: (index - 1) * 100 + "%",
              }}
            >
              <Image
                src={card}
                alt={`Card variation ${index + 1} large preview`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfessionalCards = () => {
  const { isOpen, open, close } = useModalState();
  return (
    <Section className="flex flex-col gap-6">
      <IntroPoint title="#1">
        <h2 className="text-2xl font-normal font-serif mt-10 mb-2">
          Professional cards
        </h2>
        <p className="text-secondary">Understanding client's needs</p>
      </IntroPoint>

      <IntroPoint title="Problem">
        The professional card is a crucial element on the page. By that moment,
        we used to have several views from different models from different ages
        — it was hard to track why some of those decisions were made and how to
        make it "sell" professionals to clients.
      </IntroPoint>
      <SectionContent>
        <Illustration
          src={"/img/resume/sos-project-overview/cards-initial.png"}
          caption={"Initial version of professional cards"}
        />
      </SectionContent>
      <IntroPoint title="Process">
        <p>
          While we had some other hypotheses to test, I initiated a series of
          user interviews to come prepared for iterating on cards. The focus was
          on:
        </p>
        <ul className="list-disc ml-5 space-y-2 my-4">
          <li>Finding out the previous hiring experience;</li>
          <li>
            How different profile elements affect the process comparison of
            professionals.
          </li>
        </ul>
        <button
          type="button"
          className="flex bg-background rounded-xl mb-6 overflow-hidden w-full transition-colors border-1 border-background-05 hover:bg-foreground hover:text-background hover:border-foreground cursor-pointer transition-0.2"
          onClick={open}
        >
          <Image
            src={"/img/resume/sos-project-overview/procards.png"}
            alt={"Initial version of professional cards"}
            width={160}
            height={0}
          />
          <div className="flex flex-col items-start justify-center w-full h-full p-4">
            <h3>Cards interview</h3>
            <p>Click to see the details</p>
          </div>
        </button>
        <p>
          With all that I'd set to cards redesign and launched a series of AB
          tests to tailor the application of the findings.
        </p>
      </IntroPoint>
      <IntroPoint title="Results">
        We've ended up with several variations tailored per type of professional
        or stage of interactions (contacted or not, applying or not, 'bookable
        online', etc).
      </IntroPoint>

      <CardsGallery />
      {isOpen && <ResearchModal close={close} />}
      <IntroPoint title="">
        It resulted in increased client engagements with professionals and better usability tests feedback.
      </IntroPoint>
      <div className="grid-1-to-3">
        <div />
        <div className="flex gap-12">
          <div className="flex flex-col gap-1">
            <p className="text-secondary">Target conversion on mobile</p>

            <p className="text-2xl font-medium font-mono">~40% increase</p>
          </div>
          <div className="flex flex-col gap-1">

            <p className="text-secondary">Target conversion on desktop</p>

            <p className="text-2xl font-medium font-mono">~25% increase</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProfessionalCards;
