"use client";

import { getImageProps } from "next/image";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type LightboxItem = {
  src: string;
  alt: string;
  kind?: "image" | "video";
};

/** The on-page element a zoom grows out of and returns to. */
export type ZoomThumb = HTMLImageElement | HTMLVideoElement;

type Rect = { left: number; top: number; width: number; height: number };

type Seen = {
  aspect: number;
  /** Largest width worth showing (CSS px): a video's native width. */
  maxWidth?: number;
  /** Already-downloaded thumbnail file to show while the full one loads. */
  preview?: string;
};

// Breathing room between the zoomed media and the viewport edge.
const GUTTER = 32;

// Keys that would scroll the page. While zoomed they close instead, the same
// way the wheel does — any intent to move on puts the image back.
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

const isVideoEl = (el: ZoomThumb): el is HTMLVideoElement =>
  el instanceof HTMLVideoElement;

const fitToViewport = ({ aspect, maxWidth = Infinity }: Seen): Rect => {
  const width = Math.min(
    window.innerWidth - GUTTER * 2,
    (window.innerHeight - GUTTER * 2) * aspect,
    maxWidth,
  );
  const height = width / aspect;
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
};

// What a loaded thumbnail tells us up front. Videos are capped at their
// native size: past 1:1 a zoom only magnifies compression artefacts.
const measure = (el: ZoomThumb | null): Seen | null => {
  if (!el) return null;
  if (isVideoEl(el)) {
    if (!el.videoWidth) return null;
    return { aspect: el.videoWidth / el.videoHeight, maxWidth: el.videoWidth };
  }
  if (!el.naturalWidth) return null;
  return {
    aspect: el.naturalWidth / el.naturalHeight,
    preview: el.currentSrc,
  };
};

// FLIP: the frame is laid out at its final rect; this transform makes it
// look like it still sits on the thumbnail. Animating it to `none` grows the
// image out of the page, animating towards it puts the image back.
const flipFrom = (from: DOMRect, to: Rect) =>
  `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${
    from.width / to.width
  }, ${from.height / to.height})`;

const isOnScreen = (r: DOMRect) =>
  r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;

// Durations/easing come from the design tokens so the zoom moves like the
// rest of the site. WAAPI can't resolve var(), hence the computed lookup.
const motion = () => {
  const css = getComputedStyle(document.documentElement);
  // Tokens arrive minified ("300ms" → ".3s"), so honour the unit.
  const ms = (name: string, fallback: number) => {
    const value = css.getPropertyValue(name).trim();
    const n = Number.parseFloat(value);
    if (Number.isNaN(n)) return fallback;
    return value.endsWith("ms") ? n : value.endsWith("s") ? n * 1000 : n;
  };
  return {
    enter: ms("--duration-slow", 300),
    exit: ms("--duration-enter", 200),
    easing:
      css.getPropertyValue("--ease-entrance").trim() ||
      "cubic-bezier(0.32, 0.72, 0, 1)",
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
};

/**
 * Thumbnail bookkeeping for a page that opens a Lightbox: which on-page
 * image/video each src is (the zoom grows out of it and returns to it), and
 * whether zooming is on at all — mouse/trackpad only, phones already show
 * media full-width and keep native pinch-zoom.
 */
export function useZoomThumbs() {
  const thumbs = useRef(new Map<string, ZoomThumb>());
  const enabled = useMediaQuery("(pointer: fine)");

  const getThumb = useCallback(
    (src: string) => thumbs.current.get(src) ?? null,
    [],
  );

  const register = useCallback(
    (src: string) => (el: ZoomThumb | null) => {
      if (el) thumbs.current.set(src, el);
      else thumbs.current.delete(src);
    },
    [],
  );

  // Spread onto the thumbnail. Attributes only — toggling them never
  // remounts the element, so the hydration pass (enabled=false) doesn't flash.
  const trigger = (open: () => void) =>
    enabled
      ? {
          role: "button",
          tabIndex: 0,
          onClick: open,
          onKeyDown: (e: ReactKeyboardEvent) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            // keep the home list's Enter-to-open from firing too
            e.stopPropagation();
            open();
          },
        }
      : {};

  return { enabled, getThumb, register, trigger };
}

type LightboxProps = {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  /** Called once the close animation has finished — unmount then. */
  onClose: () => void;
  getThumb: (src: string) => ZoomThumb | null;
};

/**
 * Click-to-zoom: the image or video grows out of its place on the page to
 * fit the viewport over a dimmed backdrop. Click, Esc or scroll puts it
 * back; ←/→ (and j/l) step through `items`.
 *
 * Mount it to open, and unmount it from `onClose`.
 */
const Lightbox = ({
  items,
  index,
  onIndexChange,
  onClose,
  getThumb,
}: LightboxProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openedRef = useRef(false);
  const closingRef = useRef(false);
  // The frame's laid-out rect (pre-transform), for the close animation.
  const targetRef = useRef<Rect | null>(null);

  const item = items[index];
  const isVideo = item.kind === "video";

  // Per src, unknown until either the thumbnail or the full file has loaded.
  const [seen, setSeen] = useState<Record<string, Seen>>({});
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [, setViewport] = useState(0);

  const current = seen[item.src];
  const target = current ? fitToViewport(current) : null;

  const remember = useCallback((src: string, value: Seen | null) => {
    if (!value) return;
    setSeen((prev) => (prev[src] ? prev : { ...prev, [src]: value }));
  }, []);

  // Seed from the thumbnail before paint, so the first frame is already in
  // place for the open animation.
  useLayoutEffect(() => {
    setLoadedSrc(null);
    remember(item.src, measure(getThumb(item.src)));
  }, [item.src, getThumb, remember]);

  // A video's stand-in while the zoomed copy buffers: the thumbnail's
  // current frame, painted onto a canvas. Painting is allowed even though
  // R2 sends no CORS headers — only reading the pixels back would not be.
  useLayoutEffect(() => {
    const thumb = getThumb(item.src);
    const canvas = canvasRef.current;
    if (!canvas || !thumb || !isVideoEl(thumb) || !thumb.videoWidth) return;
    canvas.width = thumb.videoWidth;
    canvas.height = thumb.videoHeight;
    canvas.getContext("2d")?.drawImage(thumb, 0, 0);
  });

  // Open: modal top layer, then grow out of the thumbnail once the target
  // rect is known (immediately, unless the thumbnail hadn't loaded).
  useLayoutEffect(() => {
    targetRef.current = target;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    if (openedRef.current || !target) return;
    openedRef.current = true;

    const { enter, easing, reduced } = motion();
    const timing = { duration: enter, easing };
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], timing);

    const from = getThumb(item.src)?.getBoundingClientRect();
    frameRef.current?.animate(
      from && isOnScreen(from) && !reduced
        ? [{ transform: flipFrom(from, target) }, { transform: "none" }]
        : [{ opacity: 0 }, { opacity: 1 }],
      timing,
    );
  });

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const { exit, easing, reduced } = motion();
    const timing = { duration: exit, easing, fill: "forwards" as const };

    // Stepped to something that's scrolled away (posters stack them):
    // bring it on screen so the zoom has somewhere to land.
    const thumb = getThumb(item.src);
    if (thumb && !isOnScreen(thumb.getBoundingClientRect())) {
      thumb.scrollIntoView({ block: "center", behavior: "instant" });
    }
    const to = thumb?.getBoundingClientRect();
    const frame = frameRef.current;
    const rect = targetRef.current;

    const animations = [
      backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], timing),
      frame?.animate(
        to && rect && isOnScreen(to) && !reduced
          ? [{ transform: "none" }, { transform: flipFrom(to, rect) }]
          : [{ opacity: 1 }, { opacity: 0 }],
        timing,
      ),
    ];

    const done = () => {
      dialogRef.current?.close();
      onClose();
    };
    Promise.all(animations.map((a) => a?.finished)).then(done, done);
  }, [getThumb, item.src, onClose]);

  // Keys and scroll. Capture phase on window runs before every other
  // listener on the page, so stopPropagation keeps the home list (↑↓ Enter)
  // and the carousel (←→ j l) from also reacting while zoomed.
  useEffect(() => {
    const step = (delta: number) =>
      onIndexChange((index + delta + items.length) % items.length);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") return;
      e.stopPropagation();
      // Escape is left to the dialog's own cancel event (below).
      if (SCROLL_KEYS.has(e.key)) {
        e.preventDefault();
        requestClose();
      } else if (items.length > 1 && !e.repeat) {
        if (e.key === "ArrowRight" || e.key === "l") step(1);
        if (e.key === "ArrowLeft" || e.key === "j") step(-1);
      }
    };
    // Held still: the page doesn't scroll out from under the closing image.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      requestClose();
    };
    const onResize = () => setViewport((n) => n + 1);

    const dialog = dialogRef.current;
    window.addEventListener("keydown", onKeyDown, { capture: true });
    dialog?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      dialog?.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [index, items.length, onIndexChange, requestClose]);

  const fullClass = cn(
    "absolute inset-0 size-full transition-opacity duration-(--duration-enter) ease-micro",
    loadedSrc === item.src ? "opacity-100" : "opacity-0",
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the window capture listener above
    <dialog
      ref={dialogRef}
      aria-label={item.alt}
      className="fixed inset-0 m-0 p-0 size-full max-w-none max-h-none bg-transparent border-0 overflow-hidden outline-none cursor-zoom-out backdrop:bg-transparent"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={requestClose}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
      />
      <div
        ref={frameRef}
        className={cn("fixed origin-top-left", !target && "invisible")}
        style={target ?? undefined}
      >
        {isVideo ? (
          <>
            <canvas
              key={`${item.src}-frame`}
              ref={canvasRef}
              aria-hidden
              className="absolute inset-0 size-full"
            />
            <video
              key={item.src}
              src={item.src}
              aria-label={item.alt}
              autoPlay
              loop
              muted
              playsInline
              // pick up where the thumbnail is, so zooming doesn't restart it
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                const thumb = getThumb(item.src);
                if (thumb && isVideoEl(thumb)) {
                  video.currentTime = thumb.currentTime;
                }
                remember(item.src, measure(video));
              }}
              onPlaying={() => setLoadedSrc(item.src)}
              className={fullClass}
            />
          </>
        ) : (
          <ZoomImage
            item={item}
            seen={current}
            target={target}
            className={fullClass}
            onLoad={(img) => {
              setLoadedSrc(item.src);
              remember(item.src, measure(img));
            }}
          />
        )}
      </div>
    </dialog>
  );
};

const ZoomImage = ({
  item,
  seen,
  target,
  className,
  onLoad,
}: {
  item: LightboxItem;
  seen?: Seen;
  target: Rect | null;
  className: string;
  onLoad: (img: HTMLImageElement) => void;
}) => {
  // Full-size source through the image optimizer, picked for the size it's
  // actually shown at. The optimizer never upscales past the original.
  const { props: full } = getImageProps({
    src: item.src,
    alt: item.alt,
    width: 2400,
    height: Math.round(2400 / (seen?.aspect ?? 1)),
    sizes: target ? `${Math.ceil(target.width)}px` : "100vw",
    loading: "eager",
  });

  return (
    <>
      {seen?.preview && (
        // The thumbnail's own file, already in cache: shown instantly and
        // sharpened by the full-size image fading in on top.
        // biome-ignore lint/performance/noImgElement: cached thumbnail, not a new download
        <img
          src={seen.preview}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full"
        />
      )}
      {/* biome-ignore lint/performance/noImgElement: props come from getImageProps */}
      <img
        key={item.src}
        {...full}
        alt={item.alt}
        onLoad={(e) => onLoad(e.currentTarget)}
        className={className}
      />
    </>
  );
};

export default Lightbox;
