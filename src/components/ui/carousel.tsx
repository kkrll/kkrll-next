"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons, CarouselButton } from "./carouselButtons";
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
  buttonsPosition?: "top" | "bottom";
};

const Carousel = ({
  children,
  options,
  nbSlides,
  carouselName,
  buttonsPosition = "bottom",
}: CarouselType) => {
  const fadePlugin = useMemo(() => [Fade()], []);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, fadePlugin);
  const [currentSlide, setCurrentSlide] = useState(1);
  const prevCarouselNameRef = useRef(carouselName);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key === "ArrowRight" || e.key === "l") {
        onNextButtonClick();
        nextButtonRef.current?.classList.add("active-pressed");
      }
      if (e.key === "ArrowLeft" || e.key === "j") {
        onPrevButtonClick();
        prevButtonRef.current?.classList.add("active-pressed");
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") {
        nextButtonRef.current?.classList.remove("active-pressed");
      }
      if (e.key === "ArrowLeft" || e.key === "j") {
        prevButtonRef.current?.classList.remove("active-pressed");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onNextButtonClick, onPrevButtonClick]);

  return (
    <section className="embla">

      {nbSlides > 1 && buttonsPosition === "top" && (
        <div className="embla__controls mb-4 font-mono justify-between flex items-center w-full">
          <div className="embla__buttons">
            <CarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              ref={prevButtonRef}
            >
              <ArrowLeftIcon size={16} />
            </CarouselButton>
            <CarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              ref={nextButtonRef}
            >
              <ArrowRightIcon size={16} />
            </CarouselButton>
          </div>
          {emblaApi && (
            <p className="text-right mr-4">{`${currentSlide} / ${nbSlides}`}</p>
          )}
        </div>
      )}

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">{children}</div>
      </div>

      {nbSlides > 1 && buttonsPosition === "bottom" && (
        <div className="embla__controls font-mono justify-between flex items-center w-full">
          <div className="embla__buttons">
            <CarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              ref={prevButtonRef}
            >
              <ArrowLeftIcon size={16} />
            </CarouselButton>
            <CarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              ref={nextButtonRef}
            >
              <ArrowRightIcon size={16} />
            </CarouselButton>
          </div>
          {emblaApi && (
            <p className="text-right mr-4">{`${currentSlide} / ${nbSlides}`}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Carousel;
