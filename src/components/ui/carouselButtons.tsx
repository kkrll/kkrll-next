import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect).off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton = React.forwardRef<HTMLButtonElement, PropType>(
  (props, ref) => {
    const { children, ...restProps } = props;
    return (
      <button
        ref={ref}
        className="embla__button embla__button--prev nice-button"
        type="button"
        {...restProps}
      >
        <span>
          {children}
        </span>
      </button>
    );
  }
);
PrevButton.displayName = 'PrevButton';

export const NextButton = React.forwardRef<HTMLButtonElement, PropType>(
  (props, ref) => {
    const { children, ...restProps } = props;
    return (
      <button
        className="embla__button embla__button--next nice-button"
        type="button"
        ref={ref}
        {...restProps}
      >
        <span>
          {children}
        </span>
      </button>
    );
  }
)
