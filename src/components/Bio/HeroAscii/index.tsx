"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTracking } from "@/hooks/useTracking";
import {
  DRAW_ASCII_CHARS,
  CHAR_HEIGHT,
  CHAR_WIDTH,
  FONT,
  IMAGE_ASCII_CHARS,
} from "./constants";
import type { CharCell, Colors } from "./types";
import SymbolSelector from "./SymbolSelector";
import DrawingControls from "./DrawingControls";
import ResizingIndicator from "./ResizingIndicator";
import { useThemeStore } from "@/stores/useThemeStore";
import convertImageToGrid from "./imageToAscii";
import { generateAsciiTxt, uploadAsciiToR2 } from "./asciiSavingUtils";

export default function HeroAscii({
  isDrawingMode,
  onToggleDrawingMode,
}: {
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<CharCell[]>([]);
  const isDraggingRef = useRef(false);
  const colorsRef = useRef<Colors>({ bg: "", fg: "" });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const asciiCharsDrawRef = useRef<string[]>([
    ...IMAGE_ASCII_CHARS,
    ...DRAW_ASCII_CHARS,
  ]);
  const selectedSymbolRef = useRef(8);

  const [selectedSymbol, setSelectedSymbol] = useState(8);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState(false);

  const { track } = useTracking();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    selectedSymbolRef.current = selectedSymbol;
  }, [selectedSymbol]);

  const getCanvasDimensions = useCallback((canvas: HTMLCanvasElement) => {
    return {
      width: canvas.width,
      height: canvas.height,
      cols: Math.ceil(canvas.width / CHAR_WIDTH),
      rows: Math.ceil(canvas.height / CHAR_HEIGHT),
    };
  }, []);

  const updateColors = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(canvas);
    colorsRef.current = {
      bg: styles.backgroundColor,
      fg: styles.color,
    };
  }, []);

  const initGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { cols, rows } = getCanvasDimensions(canvas);
    const newGrid: CharCell[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const gradientProgress = 1 - row / (rows - 1);
        const gradientLevel = gradientProgress * 4;
        const randomOffset = (Math.random() - 0.5) * 2;
        const baseLevel = Math.max(
          0,
          Math.min(4, Math.floor(gradientLevel + randomOffset)),
        );

        newGrid.push({
          baseLevel,
          currentLevel: baseLevel,
          col,
          row,
        });
      }
    }

    gridRef.current = newGrid;
  }, [getCanvasDimensions]);

  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateColors();
    const { bg, fg } = colorsRef.current;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT;
    ctx.textBaseline = "top";
    ctx.fillStyle = fg;

    gridRef.current.forEach((cell) => {
      const x = cell.col * CHAR_WIDTH;
      const y = cell.row * CHAR_HEIGHT;
      ctx.fillText(asciiCharsDrawRef.current[cell.currentLevel] || "", x, y);
    });
  }, [updateColors]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: subscribe to theme changes
  useEffect(() => {
    requestAnimationFrame(() => {
      renderGrid();
    });
  }, [theme, renderGrid]);

  const resizeGridPerephery = useCallback(
    (newWidth: number, newHeight: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const oldGrid = gridRef.current;
      const { cols: oldCols, rows: oldRows } = getCanvasDimensions(canvas);

      const newCols = Math.ceil(newWidth / CHAR_WIDTH);
      const newRows = Math.ceil(newHeight / CHAR_HEIGHT);

      const colOffset = Math.floor((newCols - oldCols) / 2);
      const rowOffset = Math.floor((newRows - oldRows) / 2);

      const newGrid: CharCell[] = [];

      for (let row = 0; row < newRows; row++) {
        for (let col = 0; col < newCols; col++) {
          const oldCol = col - colOffset;
          const oldRow = row - rowOffset;

          if (
            oldRow >= 0 &&
            oldRow < oldRows &&
            oldCol >= 0 &&
            oldCol < oldCols
          ) {
            const oldIndex = oldRow * oldCols + oldCol;
            const oldCell = oldGrid[oldIndex];

            newGrid.push({
              ...oldCell,
              col,
              row,
            });
          } else {
            if (isDrawingMode) {
              newGrid.push({
                baseLevel: 0,
                currentLevel: 0,
                col,
                row,
              });
            } else {
              const gradientProgress = 1 - row / (newRows - 1);
              const gradientLevel = gradientProgress * 4;
              const randomOffset = (Math.random() - 0.5) * 2;
              const baseLevel = Math.max(
                0,
                Math.min(4, Math.floor(gradientLevel + randomOffset)),
              );

              newGrid.push({
                baseLevel,
                currentLevel: baseLevel,
                col,
                row,
              });
            }
          }
        }
      }
      gridRef.current = newGrid;
    },
    [getCanvasDimensions, isDrawingMode],
  );

  const handleWindowResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (gridRef.current.length > 0) {
      resizeGridPerephery(newWidth, newHeight);
    } else {
      initGrid();
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    renderGrid();
    setIsResizing(false);
  }, [resizeGridPerephery, initGrid, renderGrid]);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const debounceWindowResize = useDebounce(handleWindowResize, 200);

  const triggerResize = useCallback(() => {
    handleResizeStart();
    debounceWindowResize();
  }, [handleResizeStart, debounceWindowResize]);

  const drawCell = useCallback(
    (ctx: CanvasRenderingContext2D, cell: CharCell) => {
      const { bg, fg } = colorsRef.current;
      const x = cell.col * CHAR_WIDTH;
      const y = cell.row * CHAR_HEIGHT;

      ctx.fillStyle = bg;
      ctx.fillRect(x, y, CHAR_WIDTH, CHAR_HEIGHT);

      ctx.fillStyle = fg;
      ctx.fillText(asciiCharsDrawRef.current[cell.currentLevel] || "", x, y);
    },
    [],
  );

  const getCellAtPosition = useCallback(
    (canvas: HTMLCanvasElement, x: number, y: number) => {
      const col = Math.floor(x / CHAR_WIDTH);
      const row = Math.floor(y / CHAR_HEIGHT);
      const cols = Math.ceil(canvas.width / CHAR_WIDTH);
      const rows = Math.ceil(canvas.height / CHAR_HEIGHT);

      if (col < 0 || col >= cols || row < 0 || row >= rows) {
        return undefined;
      }

      const index = row * cols + col;
      return gridRef.current[index];
    },
    [],
  );

  const handleDraw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!isDraggingRef.current || !canvas) return;

      if (animationFrameRef.current) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x =
          "touches" in e
            ? e.touches[0].clientX - rect.left
            : e.clientX - rect.left;
        const y =
          "touches" in e
            ? e.touches[0].clientY - rect.top
            : e.clientY - rect.top;

        const cell = getCellAtPosition(canvas, x, y);
        if (cell) {
          cell.currentLevel = selectedSymbolRef.current;
          ctx.font = FONT;
          ctx.textBaseline = "top";
          drawCell(ctx, cell);
        }

        animationFrameRef.current = undefined;
      });
    },
    [getCellAtPosition, drawCell],
  );

  const handleStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      handleDraw(e);
    },
    [handleDraw],
  );

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const handleClear = useCallback(() => {
    track("ascii_canvas_cleared");

    gridRef.current.forEach((cell) => {
      cell.currentLevel = 0;
    });

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      updateColors();
      ctx.fillStyle = colorsRef.current.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [updateColors, track]);

  const handleToggleMode = useCallback(() => {
    track(
      isDrawingMode
        ? "ascii_drawing_mode_exited"
        : "ascii_drawing_mode_entered",
    );

    if (isDrawingMode) {
      gridRef.current.forEach((cell) => {
        cell.currentLevel = cell.baseLevel;
      });
    }

    onToggleDrawingMode();
    renderGrid();
  }, [isDrawingMode, onToggleDrawingMode, renderGrid, track]);

  const handleDownloadPng = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    track("ascii_saved_as_png");

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // 1. Download PNG
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-art-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);

      // 2. Also upload TXT version to R2
      const { cols, rows } = getCanvasDimensions(canvas);
      const txtContent = generateAsciiTxt({
        grid: gridRef.current,
        symbols: asciiCharsDrawRef.current,
        cols,
        rows,
        theme,
      });

      const uploadedUrl = await uploadAsciiToR2(txtContent);
      if (uploadedUrl) {
        track("ascii_uploaded_to_r2", { url: uploadedUrl, source: "png_save" });
      }
    });
  }, [getCanvasDimensions, track, theme]);

  const handleDownloadTxt = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    track("ascii_saved_as_txt");

    const { cols, rows } = getCanvasDimensions(canvas);

    // Generate TXT with metadata
    const txtContent = generateAsciiTxt({
      grid: gridRef.current,
      symbols: asciiCharsDrawRef.current,
      cols,
      rows,
      theme,
    });

    // 1. Download locally
    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascii-art-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // 2. Upload to R2
    const uploadedUrl = await uploadAsciiToR2(txtContent);
    if (uploadedUrl) {
      track("ascii_uploaded_to_r2", { url: uploadedUrl });
      console.log("Content copied");
    }
  }, [getCanvasDimensions, track, theme]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsConverting(true);
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { cols, rows } = getCanvasDimensions(canvas);

        const convertedGrid = await convertImageToGrid(
          file,
          cols,
          rows,
          IMAGE_ASCII_CHARS,
        );

        gridRef.current = convertedGrid;
        renderGrid();

        track("ascii_image_converted");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to convert the image";
        throw new Error(message);
      } finally {
        setIsConverting(false);
      }
    },
    [getCanvasDimensions, renderGrid, track],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();

          if (file) {
            handleImageUpload(file);
          }
          break;
        }
      }
    },
    [handleImageUpload],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: initialize canvas and attach listeners once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGrid();
    renderGrid();

    window.addEventListener("resize", triggerResize);

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleDraw);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseleave", handleEnd);
    document.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("resize", triggerResize);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleDraw);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseleave", handleEnd);
      document.removeEventListener("paste", handlePaste);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGrid, handleStart, handleDraw, handleEnd, triggerResize]);

  const handleSelectSymbol = useCallback(
    (index: number) => {
      track("ascii_symbol_changed", {
        symbol: asciiCharsDrawRef.current[index],
        index,
      });
      setSelectedSymbol(index);
    },
    [track],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: Full-screen interactive canvas container
    <div
      className={`absolute t-0 l-0 w-full h-screen overflow-hidden ${
        isDrawingMode ? "opacity-100 z-100" : "opacity-15 z-0"
      } transition-opacity duration-300`}
      role="button"
      tabIndex={isDrawingMode ? -1 : 0}
      onMouseDown={() => {
        if (!isDrawingMode) {
          handleToggleMode();
        }
      }}
      onKeyDown={(e) => {
        if (!isDrawingMode && e.key === "p") {
          e.preventDefault();
          handleToggleMode();
        }
        if (isDrawingMode && e.key === "Escape") {
          e.preventDefault();
          handleToggleMode();
        }
        if (isDrawingMode && (e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          handleDownloadPng();
        }
      }}
    >
      <ResizingIndicator
        isResizing={isResizing}
        isDrawingMode={isDrawingMode}
      />

      <canvas
        ref={canvasRef}
        className={`inset-0 bg-background text-foreground-07 cursor-crosshair ${
          isDrawingMode ? "fixed" : "absolute"
        }`}
      />

      {isDrawingMode && (
        <div className="fixed top-4 right-4 left-4 flex justify-between p-4 gap-2 z-200 bg-foreground/10 text-foreground rounded-xl backdrop-blur">
          <SymbolSelector
            selectedSymbol={selectedSymbol}
            onSelectSymbol={handleSelectSymbol}
          />

          <DrawingControls
            onClear={handleClear}
            onDownloadPng={handleDownloadPng}
            onDownloadTxt={handleDownloadTxt}
            onExit={handleToggleMode}
            onImageUpload={handleImageUpload}
            isConverting={isConverting}
          />
        </div>
      )}
    </div>
  );
}
