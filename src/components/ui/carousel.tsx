"use client"

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "./carouselButtons";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import Fade from "embla-carousel-fade";

import type { EmblaOptionsType } from "embla-carousel";
import type { EmblaCarouselType } from "embla-carousel";

import "./embla.css";

type CarouselType = {
  children: ReactNode;
  options?: EmblaOptionsType;
  nbSlides: number;
  carouselName?: string;
};

const Carousel = ({
  children,
  options,
  nbSlides,
  carouselName,
}: CarouselType) => {
  const fadePlugin = useMemo(() => [Fade()], []);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, fadePlugin);
  const [currentSlide, setCurrentSlide] = useState(1);
  const prevCarouselNameRef = useRef(carouselName);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap() + 1);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reinitialize and reset to first slide when carousel content changes
  useEffect(() => {
    if (!emblaApi) return;

    // Only reset/reinit if carouselName actually changed (different carousel loaded)
    const carouselChanged = prevCarouselNameRef.current !== carouselName;
    prevCarouselNameRef.current = carouselName;

    if (!carouselChanged) return;

    // Reset to first slide
    emblaApi.scrollTo(0, true); // true = instant, no animation

    // Wait a bit for images to start loading, then recalculate dimensions
    const timer = setTimeout(() => {
      emblaApi.reInit();
    }, 100);

    return () => clearTimeout(timer);
  }, [emblaApi, carouselName]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    const handleCarouselKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") {
        onNextButtonClick();
      }
      if (e.key === "ArrowLeft" || e.key === "j") {
        onPrevButtonClick();
      }
    };
    window.addEventListener("keydown", handleCarouselKeys);

    return () => window.removeEventListener("keydown", handleCarouselKeys);
  });

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">{children}</div>
      </div>

      <div className="embla__controls font-mono justify-between flex items-center w-full">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
            <ArrowLeftIcon size={24} className="text-foreground" />
          </PrevButton>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
            <ArrowRightIcon size={24} className="text-foreground" />
          </NextButton>
        </div>
        {emblaApi && (
          <p className="text-right mr-4">{`${currentSlide} / ${nbSlides}`}</p>
        )}
      </div>
    </section>
  );
};

export default Carousel;
