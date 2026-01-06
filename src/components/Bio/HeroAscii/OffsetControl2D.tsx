import { memo, useCallback, useEffect, useRef } from "react";

interface OffsetControl2DProps {
  offsetX: number;
  offsetY: number;
  onChange: (x: number, y: number) => void;
  disabled?: boolean;
}

const CONTAINER_SIZE = 120;
const HANDLE_SIZE = 20;
const OFFSET_RANGE = 960;

const OffsetControl2D = memo(
  ({ offsetX, offsetY, onChange, disabled = false }: OffsetControl2DProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    // Convert offset to pixel position (0 to CONTAINER_SIZE)
    const offsetToPixel = useCallback((offset: number) => {
      return ((offset + OFFSET_RANGE) / (OFFSET_RANGE * 2)) * CONTAINER_SIZE;
    }, []);

    // Convert pixel position (0 to CONTAINER_SIZE) to offset
    const pixelToOffset = useCallback((pixel: number) => {
      return (pixel / CONTAINER_SIZE) * (OFFSET_RANGE * 2) - OFFSET_RANGE;
    }, []);

    const handlePosition = useCallback(
      (clientX: number, clientY: number) => {
        if (!containerRef.current || disabled) return;

        const rect = containerRef.current.getBoundingClientRect();
        let x = clientX - rect.left;
        let y = clientY - rect.top;

        // Constrain within bounds
        x = Math.max(0, Math.min(CONTAINER_SIZE, x));
        y = Math.max(0, Math.min(CONTAINER_SIZE, y));

        const newOffsetX = Math.round(pixelToOffset(x));
        const newOffsetY = Math.round(pixelToOffset(y));

        onChange(newOffsetX, newOffsetY);
      },
      [disabled, pixelToOffset, onChange],
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        isDraggingRef.current = true;
        handlePosition(e.clientX, e.clientY);
      },
      [disabled, handlePosition],
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        handlePosition(e.clientX, e.clientY);
      },
      [handlePosition],
    );

    const handleMouseUp = useCallback(() => {
      isDraggingRef.current = false;
    }, []);

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (disabled) return;
        isDraggingRef.current = true;
        const touch = e.touches[0];
        handlePosition(touch.clientX, touch.clientY);
      },
      [disabled, handlePosition],
    );

    const handleTouchMove = useCallback(
      (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const touch = e.touches[0];
        handlePosition(touch.clientX, touch.clientY);
      },
      [handlePosition],
    );

    const handleTouchEnd = useCallback(() => {
      isDraggingRef.current = false;
    }, []);

    // Attach global listeners
    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const handleX = offsetToPixel(offsetX);
    const handleY = offsetToPixel(offsetY);

    return (
      <div className="flex flex-col gap-2">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`relative bg-background-07 border border-foreground/20 rounded-xl ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-crosshair"
            }`}
          style={{
            width: CONTAINER_SIZE,
            height: CONTAINER_SIZE,
          }}
        >
          {/* Center crosshairs */}
          <div
            className="absolute bg-foreground/10"
            style={{
              left: CONTAINER_SIZE / 2 - 0.5,
              top: 0,
              width: 1,
              height: CONTAINER_SIZE,
            }}
          />
          <div
            className="absolute bg-foreground/10"
            style={{
              left: 0,
              top: CONTAINER_SIZE / 2 - 0.5,
              width: CONTAINER_SIZE,
              height: 1,
            }}
          />

          {/* Draggable handle */}
          <div
            className="absolute rounded-full cursor-grab bg-foreground border-2 border-background shadow-lg pointer-events-none"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              left: handleX - HANDLE_SIZE / 2,
              top: handleY - HANDLE_SIZE / 2,
            }}
          />
        </div>
      </div>
    );
  },
);

OffsetControl2D.displayName = "OffsetControl2D";

export default OffsetControl2D;
