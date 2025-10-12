"use client";

import { useEffect, useRef, useState } from "react";

const ASCII_CHARS = [" ", "•", "∘", "∗", "※", "░", "▒", "▓", "█"];

interface CharCell {
  baseLevel: number;
  currentLevel: number;
  col: number;
  row: number;
}

const NavButton = ({
  text,
  isSelected,
  onClick,
}: {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-8 h-8 text-sm font-mono rounded transition-colors ${
        isSelected
          ? "bg-background/100 text-foreground"
          : "bg-background/30 hover:bg-background/70 text-foreground"
      } ${text.length > 1 ? "px-4" : ""}`}
      title={text.length > 1 ? text : `Draw with: ${text || "space"}`}
    >
      {text}
    </button>
  );
};

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
  const selectedSymbolRef = useRef<number>(8);
  const charWidth = 20;
  const charHeight = 20;
  const [selectedSymbol, setSelectedSymbol] = useState<number>(8); // Default to "█"
  const asciiCharsDraw = useRef<string[]>([...ASCII_CHARS]); //
  const [customSymbol, setCustomSymbol] = useState<{
    isActive: boolean;
    symbol: string;
  }>({ isActive: false, symbol: "" });

  // Keep ref in sync with state
  useEffect(() => {
    selectedSymbolRef.current = selectedSymbol;
  }, [selectedSymbol]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get colors from canvas computed styles
    const getColors = () => {
      const styles = getComputedStyle(canvas);
      return {
        bg: styles.backgroundColor,
        fg: styles.color,
      };
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Re-initialize grid on resize
      initGrid();
    };

    const initGrid = () => {
      const cols = Math.ceil(canvas.width / charWidth);
      const rows = Math.ceil(canvas.height / charHeight);

      gridRef.current = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Gradient from left (dark/0) to right (light/4) with randomness
          const gradientProgress = col / (cols - 1);
          const gradientLevel = gradientProgress * 4;
          const randomOffset = (Math.random() - 0.5) * 2;
          const baseLevel = Math.max(
            0,
            Math.min(4, Math.floor(gradientLevel + randomOffset))
          );

          gridRef.current.push({
            baseLevel,
            currentLevel: baseLevel,
            col,
            row,
          });
        }
      }
    };

    // Draw a single cell (optimized for individual updates)
    const drawCell = (cell: CharCell) => {
      const { bg, fg } = getColors();
      const x = cell.col * charWidth;
      const y = cell.row * charHeight;

      ctx.fillStyle = bg;
      ctx.fillRect(x, y, charWidth, charHeight);

      ctx.fillStyle = fg;
      ctx.font = "14px 'Geist Mono', monospace";
      ctx.textBaseline = "top";
      ctx.fillText(asciiCharsDraw.current[cell.currentLevel] || "", x, y);
    };

    // Render entire grid (only for initial load and full updates)
    const render = () => {
      const { bg, fg } = getColors();

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px 'Geist Mono', monospace";
      ctx.textBaseline = "top";

      gridRef.current.forEach((cell) => {
        const x = cell.col * charWidth;
        const y = cell.row * charHeight;

        ctx.fillStyle = fg;
        ctx.fillText(asciiCharsDraw.current[cell.currentLevel] || "", x, y);
      });
      ctx.globalAlpha = 1; // Reset
    };

    // Get cell at mouse position
    const getCellAtPosition = (x: number, y: number) => {
      const col = Math.floor(x / charWidth);
      const row = Math.floor(y / charHeight);
      const cols = Math.ceil(canvas.width / charWidth);
      const index = row * cols + col;
      return gridRef.current[index];
    };

    // Handle drawing on cells
    const handleDraw = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const x =
        "touches" in e
          ? e.touches[0].clientX - rect.left
          : e.clientX - rect.left;
      const y =
        "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      const cell = getCellAtPosition(x, y);
      if (cell) {
        // Set to selected symbol
        cell.currentLevel = selectedSymbolRef.current;
        drawCell(cell); // Only redraw the changed cell
      }
    };

    // Mouse/Touch event handlers
    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      handleDraw(e);
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    // Initial render
    resizeCanvas();
    render();

    // Add event listeners
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleDraw);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseleave", handleEnd);

    // Disable touch for now to prevent scroll interference
    // canvas.addEventListener("touchstart", handleStart);
    // canvas.addEventListener("touchmove", handleDraw);
    // canvas.addEventListener("touchend", handleEnd);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleDraw);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseleave", handleEnd);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Clear: Set all to blank
  const handleClear = () => {
    gridRef.current.forEach((cell) => {
      cell.currentLevel = 0; // All spaces
    });
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const bg = getComputedStyle(canvas).backgroundColor;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Toggle drawing mode
  const handleToggleMode = () => {
    // Reset to base gradient when exiting drawing mode
    if (isDrawingMode) {
      gridRef.current.forEach((cell) => {
        cell.currentLevel = cell.baseLevel;
      });
    }

    onToggleDrawingMode();

    // Re-render
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const styles = getComputedStyle(canvas);
      const bg = styles.backgroundColor;
      const fg = styles.color;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px 'Geist Mono', monospace";
      ctx.textBaseline = "top";
      gridRef.current.forEach((cell) => {
        const x = cell.col * charWidth;
        const y = cell.row * charHeight;
        ctx.fillStyle = fg;
        ctx.fillText(asciiCharsDraw.current[cell.currentLevel] || "", x, y);
      });
      ctx.globalAlpha = 1;
    }
  };

  // Download canvas as image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-art-${Date.now()}.png`;
      a.click();

      URL.revokeObjectURL(url);
    });
  };

  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customSymbol.isActive && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [customSymbol.isActive]);

  const handleCustomSymbolInput = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.key.length === 1) {
      // Single character typed
      asciiCharsDraw.current = [...asciiCharsDraw.current, e.key];
      setCustomSymbol({ isActive: false, symbol: e.key });
      setSelectedSymbol(asciiCharsDraw.current.length - 1);
    }
  };

  const CustomSymbolButton = () => {
    const displaySymbol =
      asciiCharsDraw.current.length > 9 ? asciiCharsDraw.current.at(-1) : "";

    return customSymbol.isActive ? (
      <input
        ref={customInputRef}
        type="text"
        maxLength={1}
        placeholder="Type symbol"
        onKeyDown={handleCustomSymbolInput}
        onBlur={() =>
          setCustomSymbol({ isActive: false, symbol: customSymbol.symbol })
        }
        className="w-48 h-8 text-sm font-mono rounded bg-background/100 text-foreground text-center border-2 border-foreground"
      />
    ) : (
      <NavButton
        text={displaySymbol || "Enter symbol"}
        onClick={() => {
          setCustomSymbol({ isActive: true, symbol: "" });
        }}
        isSelected={selectedSymbol > 8}
      />
    );
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: Full-screen interactive canvas container
    <div
      className={`absolute t-0 l-0 w-full h-screen overflow-hidden ${
        isDrawingMode ? "opacity-100 z-100" : "opacity-25 z-0"
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
          handleDownload();
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className={`inset-0 bg-background text-foreground-07 cursor-crosshair ${
          isDrawingMode ? "fixed" : "absolute"
        }`}
      />

      {/* Drawing Mode Controls (visible when in drawing mode) */}
      {isDrawingMode && (
        <div className="absolute top-4 right-4 left-4 flex justify-between p-4 gap-2 z-200 bg-foreground/10 text-foreground rounded-xl backdrop-blur">
          {/* Symbol Selector */}
          <div className="flex gap-1">
            {ASCII_CHARS.map((char, index) => (
              <NavButton
                key={char}
                text={char}
                onClick={() => setSelectedSymbol(index)}
                isSelected={selectedSymbol === index}
              />
            ))}
            <CustomSymbolButton />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 animate-[fadeIn_200ms_ease-in-out]">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
            >
              Download
            </button>
            <button
              type="button"
              onClick={handleToggleMode}
              className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
