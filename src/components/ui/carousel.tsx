"use client";

import {
  Children,
  type ComponentPropsWithRef,
  isValidElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

// Travel (px) before a touch picks an axis: horizontal drags the slides,
// vertical is left to the browser to scroll the page.
const AXIS_LOCK = 8;
// Release past this share of the width, or flick faster than FLICK_SPEED
// (px/ms) over at least FLICK_MIN px, and the swipe goes through.
const COMMIT_SHARE = 0.25;
const FLICK_SPEED = 0.4;
const FLICK_MIN = 24;
// Matches duration-(--duration-slow) on the settling slides.
const SETTLE_MS = 300;

type Gesture = {
  x: number;
  y: number;
  width: number;
  axis: "x" | "y" | null;
  lastX: number;
  lastT: number;
  velocity: number;
};

/**
 * While a finger is down (and while the slides settle after), the active
 * slide sits at `offset` and its neighbour on `side` (+1 next, -1 previous)
 * one width further along — a real slide, not the crossfade.
 */
type Drag = { offset: number; side: 1 | -1; width: number; settling: boolean };

type CarouselProps = {
  children: ReactNode;
  /** Controlled slide index. Leave unset and the carousel keeps its own. */
  index?: number;
  onIndexChange?: (index: number) => void;
  buttonsPosition?: "top" | "bottom";
};

const CarouselButton = (props: ComponentPropsWithRef<"button">) => {
  const { children, className, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        "nice-button inline-flex items-center justify-center cursor-pointer touch-manipulation",
        className,
      )}
      // vibrate is missing on iOS Safari — calling it bare throws there
      onTouchStart={() => navigator.vibrate?.(10)}
      onTouchEnd={() => navigator.vibrate?.(10)}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
};

/**
 * Crossfading, looping slideshow. Every slide sits in the same grid cell, so
 * the carousel is as tall as its tallest slide and never jumps while
 * stepping. ←/→ (and j/l) and the buttons crossfade; on touch the slides
 * follow the finger and slide instead — the motion matches the input.
 *
 * To reset it for different content, give it a new `key`.
 */
const Carousel = ({
  children,
  index: controlledIndex,
  onIndexChange,
  buttonsPosition = "bottom",
}: CarouselProps) => {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [ownIndex, setOwnIndex] = useState(0);
  const index = controlledIndex ?? ownIndex;

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [drag, setDrag] = useState<Drag | null>(null);
  // Right after a swipe the slide that slid away is already off-screen:
  // drop it without the crossfade, or it would ghost back in the middle.
  const [skipFade, setSkipFade] = useState(false);

  const wrap = (i: number) => (i + count) % count;

  const select = (next: number) => {
    const wrapped = wrap(next);
    setOwnIndex(wrapped);
    onIndexChange?.(wrapped);
  };

  const goTo = (next: number) => {
    setSkipFade(false);
    select(next);
  };

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // Let the browser paint the current offset first, then transition to 0.
  const settle = (from: Drag) => {
    setDrag({ ...from, settling: false });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setDrag({ ...from, offset: 0, settling: true });
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => {
          setSkipFade(true);
          setDrag(null);
        }, SETTLE_MS);
      }),
    );
  };

  const release = (clientX: number) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.axis !== "x") return;
    const dx = clientX - g.x;
    const flick =
      Math.abs(dx) > FLICK_MIN &&
      Math.abs(g.velocity) > FLICK_SPEED &&
      Math.sign(g.velocity) === Math.sign(dx);
    const side: 1 | -1 = dx < 0 ? 1 : -1;

    if (Math.abs(dx) > g.width * COMMIT_SHARE || flick) {
      // The neighbour becomes active where it already is on screen, and the
      // old slide becomes its neighbour on the other side.
      select(index + side);
      settle({
        offset: dx + side * g.width,
        side: side === 1 ? -1 : 1,
        width: g.width,
        settling: false,
      });
    } else {
      settle({ offset: dx, side, width: g.width, settling: false });
    }
  };

  // Re-bound per index so the handler never steps from a stale slide.
  // biome-ignore lint/correctness/useExhaustiveDependencies: goTo is derived from index/count/onIndexChange
  useEffect(() => {
    if (count < 2) return;
    const keys = {
      next: ["ArrowRight", "l"],
      prev: ["ArrowLeft", "j"],
    };
    const buttonFor = (key: string) =>
      keys.next.includes(key)
        ? nextButtonRef.current
        : keys.prev.includes(key)
          ? prevButtonRef.current
          : null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (keys.next.includes(e.key)) goTo(index + 1);
      else if (keys.prev.includes(e.key)) goTo(index - 1);
      buttonFor(e.key)?.classList.add("active-pressed");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      buttonFor(e.key)?.classList.remove("active-pressed");
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [index, count, onIndexChange]);

  const controls = count > 1 && (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-2 font-mono",
        buttonsPosition === "top" && "mb-4",
      )}
    >
      <div className="grid grid-cols-2 items-center gap-2.5">
        <CarouselButton
          ref={prevButtonRef}
          onClick={() => goTo(index - 1)}
          aria-label="Previous"
        >
          <ArrowLeftIcon size={16} />
        </CarouselButton>
        <CarouselButton
          ref={nextButtonRef}
          onClick={() => goTo(index + 1)}
          aria-label="Next"
        >
          <ArrowRightIcon size={16} />
        </CarouselButton>
      </div>
      <p className="text-right mr-4">{`${index + 1} / ${count}`}</p>
    </div>
  );

  return (
    <section className="max-w-5xl">
      {buttonsPosition === "top" && controls}

      {/* Touch only. pan-y keeps vertical scrolling with the browser; a
          vertical drag also cancels the pointer, so it never slides. */}
      <div
        ref={viewportRef}
        className="grid touch-pan-y overflow-hidden"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" || count < 2 || drag?.settling) return;
          gesture.current = {
            x: e.clientX,
            y: e.clientY,
            width: viewportRef.current?.clientWidth || 1,
            axis: null,
            lastX: e.clientX,
            lastT: e.timeStamp,
            velocity: 0,
          };
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g) return;
          const dx = e.clientX - g.x;
          const dy = e.clientY - g.y;
          if (!g.axis) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK) return;
            g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          }
          if (g.axis === "y") {
            gesture.current = null;
            return;
          }
          const dt = e.timeStamp - g.lastT;
          if (dt > 0) g.velocity = (e.clientX - g.lastX) / dt;
          g.lastX = e.clientX;
          g.lastT = e.timeStamp;
          clearTimeout(settleTimer.current);
          setDrag({
            offset: dx,
            side: dx < 0 ? 1 : -1,
            width: g.width,
            settling: false,
          });
        }}
        onPointerUp={(e) => release(e.clientX)}
        // cancel can report clientX 0 — use where the finger last was
        onPointerCancel={() => release(gesture.current?.lastX ?? 0)}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          const peer = drag && !active && i === wrap(index + drag.side);
          const style =
            drag && (active || peer)
              ? {
                  transform: `translateX(${
                    drag.offset + (peer ? drag.side * drag.width : 0)
                  }px)`,
                  opacity: 1,
                }
              : undefined;
          return (
            <div
              key={isValidElement(slide) ? slide.key : i}
              aria-hidden={!active}
              inert={!active}
              style={style}
              className={cn(
                "[grid-area:1/1] min-w-0",
                drag
                  ? drag.settling &&
                      "transition-transform duration-(--duration-slow) ease-entrance"
                  : !skipFade &&
                      "transition-opacity duration-(--duration-slow) ease-micro",
                active ? "opacity-100" : "opacity-0",
              )}
            >
              {slide}
            </div>
          );
        })}
      </div>

      {buttonsPosition === "bottom" && controls}
    </section>
  );
};

export default Carousel;
