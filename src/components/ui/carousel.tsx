import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { PrevButton, NextButton, usePrevNextButtons } from "./carouselButtons";
import { ReactNode, useCallback, useEffect, useState } from "react";
import "./embla.css";
import Fade from "embla-carousel-fade";
import { EmblaCarouselType } from "embla-carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type CarouselType = {
  children: ReactNode;
  options?: EmblaOptionsType;
  nbSlides: number;
};

const Carousel = ({ children, options, nbSlides }: CarouselType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">{children}</div>
      </div>

      <div className="embla__controls font-mono justify-between flex items-center w-full">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
            <ArrowLeftIcon size={24} />
          </PrevButton>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
            <ArrowRightIcon size={24} />
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
