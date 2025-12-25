"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTracking } from "@/hooks/useTracking";
import {
  DEFAULT_CELL_HEIGHT,
  DEFAULT_CELL_WIDTH,
  FONT,
  IMAGE_ASCII_CHARS,
  STYLES,
} from "./constants";
import type {
  CellSize,
  ColorCharCell,
  ColorMode,
  Colors,
  EditOverlay,
  FitMode,
  SourceImage,
} from "./types";
import SymbolSelector from "./SymbolSelector";
import DrawingControls from "./DrawingControls";
import ResizingIndicator from "./ResizingIndicator";
import { useThemeStore } from "@/stores/useThemeStore";
import convertImageToGrid, { convertBitmapToGrid } from "./imageToAscii";
import { generateAsciiTxt, uploadAsciiToR2 } from "./asciiSavingUtils";
import NavButton from "./NavButton";
import Divider from "@/components/Divider";
import {
  renderCell,
  type RenderSettings,
  createDefaultRenderSettings,
} from "./renderingUtils";
import { loadRandomImage } from "./imageLoader";
import CellSizeSelector, { adjustCellSizeForStyle } from "./CellSizeSelector";
import ColorModeToggle from "./ColorModeToggle";
import {
  createEditOverlay,
  recordEdit,
  sampleEditsForCell,
  applyEditToLevel,
  clearOverlay,
  resizeOverlay,
} from "./editOverlay";
import { Darken, Lighten } from "@/components/ui/icons";

export default function HeroAscii({
  drawingMode,
  onToggleDrawingMode,
  setMode,
}: {
  drawingMode: "brush" | "increment" | "decrement" | null;
  onToggleDrawingMode: () => void;
  setMode: (mode: "brush" | "increment" | "decrement" | null) => void;
}) {
  // Canvas and grid refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<ColorCharCell[]>([]);
  const colorsRef = useRef<Colors>({ bg: "", fg: "" });
  const asciiCharsDrawRef = useRef<string[]>([...IMAGE_ASCII_CHARS]);

  // Source image storage - kept for grid regeneration on cell size change
  const sourceImageRef = useRef<SourceImage | null>(null);

  // Fit mode for the current source image (cover for library, contain for uploads)
  const fitModeRef = useRef<FitMode>("cover");

  // Edit overlay - stores user edits at pixel level for preservation across cell size changes
  const editOverlayRef = useRef<EditOverlay | null>(null);

  // Drawing state refs (avoid re-renders during drawing)
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const selectedSymbolRef = useRef(8);
  const drawingModeRef = useRef(drawingMode);
  const lastDrawnCellRef = useRef<{ row: number; col: number } | null>(null);

  // Render settings ref (avoid re-renders when settings change)
  const renderSettingsRef = useRef<RenderSettings>(
    createDefaultRenderSettings(),
  );

  // UI State
  const [selectedSymbol, setSelectedSymbol] = useState(8);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState(false);
  const [style, setStyle] = useState<"Ascii" | "Dot">("Ascii");
  const [cellSize, setCellSize] = useState<CellSize>({
    width: DEFAULT_CELL_WIDTH,
    height: DEFAULT_CELL_HEIGHT,
  });
  const [colorMode, setColorMode] = useState<ColorMode>("monochrome");
  const [hasSourceImage, setHasSourceImage] = useState(false);

  const { track } = useTracking();
  const theme = useThemeStore((state) => state.theme);

  // Sync refs with state
  useEffect(() => {
    selectedSymbolRef.current = selectedSymbol;
  }, [selectedSymbol]);

  useEffect(() => {
    drawingModeRef.current = drawingMode;
  }, [drawingMode]);

  // Get canvas dimensions based on current cell size
  const getCanvasDimensions = useCallback((canvas: HTMLCanvasElement) => {
    const currentCellSize = renderSettingsRef.current.cellSize;
    return {
      width: canvas.width,
      height: canvas.height,
      cols: Math.ceil(canvas.width / currentCellSize.width),
      rows: Math.ceil(canvas.height / currentCellSize.height),
    };
  }, []);

  // Update cached colors from CSS
  const updateColors = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(canvas);
    colorsRef.current = {
      bg: styles.backgroundColor,
      fg: styles.color,
    };
  }, []);

  // Initialize grid from random image
  const initGrid = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentCellSize = renderSettingsRef.current.cellSize;
    const cols = Math.ceil(canvas.width / currentCellSize.width);
    const rows = Math.ceil(canvas.height / currentCellSize.height);

    try {
      const file = await loadRandomImage();

      // Create ImageBitmap for source storage
      const bitmap = await createImageBitmap(file);

      // Close previous bitmap if exists
      if (sourceImageRef.current?.bitmap) {
        sourceImageRef.current.bitmap.close();
      }

      sourceImageRef.current = {
        bitmap,
        width: bitmap.width,
        height: bitmap.height,
      };
      setHasSourceImage(true);

      // Initialize edit overlay
      editOverlayRef.current = createEditOverlay(canvas.width, canvas.height);

      // Use "cover" mode for library images - fills the viewport
      fitModeRef.current = "cover";

      const convertedGrid = await convertImageToGrid(
        file,
        cols,
        rows,
        IMAGE_ASCII_CHARS,
        currentCellSize,
        "cover",
      );
      gridRef.current = convertedGrid;
    } catch (error) {
      console.error("Failed to load initial image, using blank canvas:", error);

      const blankGrid: ColorCharCell[] = new Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          blankGrid[row * cols + col] = {
            baseLevel: 0,
            currentLevel: 0,
            col,
            row,
            r: 0,
            g: 0,
            b: 0,
          };
        }
      }
      gridRef.current = blankGrid;
      editOverlayRef.current = createEditOverlay(canvas.width, canvas.height);
    }
  }, []);

  // Render the entire grid to canvas
  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateColors();
    const colors = colorsRef.current;
    const currentCellSize = renderSettingsRef.current.cellSize;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT;
    ctx.textBaseline = "top";
    ctx.fillStyle = colors.fg;

    gridRef.current.forEach((cell) => {
      const x = cell.col * currentCellSize.width;
      const y = cell.row * currentCellSize.height;
      renderCell(
        ctx,
        cell,
        renderSettingsRef.current,
        x,
        y,
        asciiCharsDrawRef.current,
        colors,
      );
    });
  }, [updateColors]);

  // Handle style changes
  useEffect(() => {
    renderSettingsRef.current.style = style;
    renderGrid();
  }, [style, renderGrid]);

  // Handle theme changes
  useEffect(() => {
    renderSettingsRef.current.invert = theme === "light";
    requestAnimationFrame(() => {
      renderGrid();
    });
  }, [theme, renderGrid]);

  // Handle cell size changes - regenerate grid from source
  const handleCellSizeChange = useCallback(
    async (newCellSize: CellSize) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      setIsResizing(true);

      // Update render settings
      renderSettingsRef.current.cellSize = newCellSize;
      setCellSize(newCellSize);

      const cols = Math.ceil(canvas.width / newCellSize.width);
      const rows = Math.ceil(canvas.height / newCellSize.height);

      // Regenerate grid from source image if available
      if (sourceImageRef.current) {
        try {
          const newGrid = await convertBitmapToGrid(
            sourceImageRef.current.bitmap,
            cols,
            rows,
            IMAGE_ASCII_CHARS,
            newCellSize,
            fitModeRef.current,
          );

          // Apply edits from overlay
          const overlay = editOverlayRef.current;
          if (overlay) {
            newGrid.forEach((cell) => {
              const edit = sampleEditsForCell(
                overlay,
                cell.col,
                cell.row,
                newCellSize,
              );
              if (edit) {
                cell.currentLevel = applyEditToLevel(
                  cell.baseLevel,
                  edit,
                  IMAGE_ASCII_CHARS.length - 1,
                );
              }
            });
          }

          gridRef.current = newGrid;
        } catch (error) {
          console.error("Failed to regenerate grid:", error);
        }
      } else {
        // No source image - create blank grid
        const blankGrid: ColorCharCell[] = new Array(cols * rows);
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            blankGrid[row * cols + col] = {
              baseLevel: 0,
              currentLevel: 0,
              col,
              row,
              r: 0,
              g: 0,
              b: 0,
            };
          }
        }
        gridRef.current = blankGrid;
      }

      renderGrid();
      setIsResizing(false);

      track("ascii_cell_size_changed", {
        cell_width: newCellSize.width,
        cell_height: newCellSize.height,
      });
    },
    [renderGrid, track],
  );

  // Debounced cell size change for slider
  const debouncedCellSizeChange = useDebounce(handleCellSizeChange, 200);

  // Handle color mode toggle
  const handleColorModeToggle = useCallback(() => {
    const newMode = colorMode === "monochrome" ? "original" : "monochrome";
    setColorMode(newMode);
    renderSettingsRef.current.colorMode = newMode;
    renderGrid();

    track("ascii_color_mode_changed", { color_mode: newMode });
  }, [colorMode, renderGrid, track]);

  // Resize grid while preserving content (center-anchored)
  const resizeGridPerephery = useCallback(
    (newWidth: number, newHeight: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const oldGrid = gridRef.current;
      const { cols: oldCols, rows: oldRows } = getCanvasDimensions(canvas);
      const currentCellSize = renderSettingsRef.current.cellSize;

      const newCols = Math.ceil(newWidth / currentCellSize.width);
      const newRows = Math.ceil(newHeight / currentCellSize.height);

      const colOffset = Math.floor((newCols - oldCols) / 2);
      const rowOffset = Math.floor((newRows - oldRows) / 2);

      const newGrid: ColorCharCell[] = new Array(newCols * newRows);

      const blankLevel = renderSettingsRef.current.invert
        ? asciiCharsDrawRef.current.length - 1
        : 0;

      for (let row = 0; row < newRows; row++) {
        for (let col = 0; col < newCols; col++) {
          const newIndex = row * newCols + col;
          const oldCol = col - colOffset;
          const oldRow = row - rowOffset;

          if (
            oldRow >= 0 &&
            oldRow < oldRows &&
            oldCol >= 0 &&
            oldCol < oldCols
          ) {
            const oldIndex = oldRow * oldCols + oldCol;
            const cell = oldGrid[oldIndex];
            cell.col = col;
            cell.row = row;
            newGrid[newIndex] = cell;
          } else {
            newGrid[newIndex] = {
              baseLevel: blankLevel,
              currentLevel: blankLevel,
              col,
              row,
              r: 0,
              g: 0,
              b: 0,
            };
          }
        }
      }
      gridRef.current = newGrid;

      // Resize edit overlay
      if (editOverlayRef.current) {
        resizeOverlay(editOverlayRef.current, newWidth, newHeight);
      }
    },
    [getCanvasDimensions],
  );

  // Handle window resize
  const handleWindowResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (gridRef.current.length > 0) {
      resizeGridPerephery(newWidth, newHeight);
    } else {
      const reinit = async () => {
        await initGrid();
        renderGrid();
      };
      reinit();
      return;
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

  // Draw a single cell (used during drawing for incremental updates)
  const drawCell = useCallback(
    (ctx: CanvasRenderingContext2D, cell: ColorCharCell) => {
      const { bg, fg } = colorsRef.current;
      const currentCellSize = renderSettingsRef.current.cellSize;
      const x = cell.col * currentCellSize.width;
      const y = cell.row * currentCellSize.height;

      ctx.fillStyle = bg;
      ctx.fillRect(x, y, currentCellSize.width, currentCellSize.height);

      ctx.fillStyle = fg;

      const maxLevel = asciiCharsDrawRef.current.length - 1;
      // Apply inversion for light mode, just like renderCell does
      const level = renderSettingsRef.current.invert
        ? maxLevel - cell.currentLevel
        : cell.currentLevel;

      if (renderSettingsRef.current.style === "Dot") {
        const maxRadius =
          Math.min(currentCellSize.width, currentCellSize.height) / 2;
        const radius = (level / maxLevel) * maxRadius;
        const centerX = x + currentCellSize.width / 2;
        const centerY = y + currentCellSize.height / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillText(asciiCharsDrawRef.current[level], x, y);
      }
    },
    [],
  );

  // Get cell at mouse/touch position
  const getCellAtPosition = useCallback(
    (canvas: HTMLCanvasElement, x: number, y: number) => {
      const currentCellSize = renderSettingsRef.current.cellSize;
      const col = Math.floor(x / currentCellSize.width);
      const row = Math.floor(y / currentCellSize.height);
      const cols = Math.ceil(canvas.width / currentCellSize.width);
      const rows = Math.ceil(canvas.height / currentCellSize.height);

      if (col < 0 || col >= cols || row < 0 || row >= rows) {
        return undefined;
      }

      const index = row * cols + col;
      return gridRef.current[index];
    },
    [],
  );

  // Handle drawing
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
          const isDifferentCell =
            !lastDrawnCellRef.current ||
            lastDrawnCellRef.current.row !== cell.row ||
            lastDrawnCellRef.current.col !== cell.col;

          if (isDifferentCell) {
            const mode = drawingModeRef.current;
            const currentCellSize = renderSettingsRef.current.cellSize;

            switch (mode) {
              case "brush":
                cell.currentLevel = selectedSymbolRef.current;
                break;
              case "increment":
                cell.currentLevel = Math.min(
                  cell.currentLevel + 1,
                  asciiCharsDrawRef.current.length - 1,
                );
                break;
              case "decrement":
                cell.currentLevel = Math.max(cell.currentLevel - 1, 0);
                break;
            }

            // Record edit to overlay for preservation across cell size changes
            if (editOverlayRef.current && mode) {
              recordEdit(
                editOverlayRef.current,
                cell.col,
                cell.row,
                currentCellSize,
                {
                  level:
                    mode === "brush" ? selectedSymbolRef.current : undefined,
                  delta:
                    mode === "increment"
                      ? 1
                      : mode === "decrement"
                        ? -1
                        : undefined,
                  mode,
                },
              );
            }

            lastDrawnCellRef.current = { row: cell.row, col: cell.col };
            ctx.font = FONT;
            ctx.textBaseline = "top";
            drawCell(ctx, cell);
          }
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
    lastDrawnCellRef.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  // Handle clear - reset to base levels and clear edit overlay
  const handleClear = useCallback(() => {
    track("ascii_canvas_cleared");

    gridRef.current.forEach((cell) => {
      cell.currentLevel = cell.baseLevel;
    });

    // Clear edit overlay
    if (editOverlayRef.current) {
      clearOverlay(editOverlayRef.current);
    }

    renderGrid();
  }, [renderGrid, track]);

  // Handle toggle drawing mode
  const handleToggleMode = useCallback(() => {
    track(
      drawingMode ? "ascii_drawing_mode_exited" : "ascii_drawing_mode_entered",
    );

    if (drawingMode) {
      // Exiting drawing mode - reset to base levels
      gridRef.current.forEach((cell) => {
        cell.currentLevel = cell.baseLevel;
      });
      // Clear edit overlay when exiting
      if (editOverlayRef.current) {
        clearOverlay(editOverlayRef.current);
      }
    }

    onToggleDrawingMode();
    renderGrid();
  }, [drawingMode, onToggleDrawingMode, renderGrid, track]);

  // Handle style toggle - adjust cell size for new style
  const handleStyleToggle = useCallback(() => {
    const newStyle =
      STYLES.indexOf(style) === STYLES.length - 1
        ? STYLES[0]
        : STYLES[STYLES.indexOf(style) + 1];

    setStyle(newStyle);

    // Adjust cell size for new style
    const newCellSize = adjustCellSizeForStyle(cellSize, newStyle);
    if (
      newCellSize.width !== cellSize.width ||
      newCellSize.height !== cellSize.height
    ) {
      debouncedCellSizeChange(newCellSize);
    }
  }, [style, cellSize, debouncedCellSizeChange]);

  // Handle download PNG
  const handleDownloadPng = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    track("ascii_saved_as_png");

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-art-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);

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

  // Handle download TXT
  const handleDownloadTxt = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    track("ascii_saved_as_txt");

    const { cols, rows } = getCanvasDimensions(canvas);

    const txtContent = generateAsciiTxt({
      grid: gridRef.current,
      symbols: asciiCharsDrawRef.current,
      cols,
      rows,
      theme,
    });

    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascii-art-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    const uploadedUrl = await uploadAsciiToR2(txtContent);
    if (uploadedUrl) {
      track("ascii_uploaded_to_r2", { url: uploadedUrl });
    }
  }, [getCanvasDimensions, track, theme]);

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsConverting(true);
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const currentCellSize = renderSettingsRef.current.cellSize;
        const cols = Math.ceil(canvas.width / currentCellSize.width);
        const rows = Math.ceil(canvas.height / currentCellSize.height);

        // Create ImageBitmap for source storage
        const bitmap = await createImageBitmap(file);

        // Close previous bitmap if exists
        if (sourceImageRef.current?.bitmap) {
          sourceImageRef.current.bitmap.close();
        }

        sourceImageRef.current = {
          bitmap,
          width: bitmap.width,
          height: bitmap.height,
        };
        setHasSourceImage(true);

        // Reset edit overlay
        editOverlayRef.current = createEditOverlay(canvas.width, canvas.height);

        // Use "contain" mode for user uploads - shows full image with letterboxing
        fitModeRef.current = "contain";

        const convertedGrid = await convertImageToGrid(
          file,
          cols,
          rows,
          IMAGE_ASCII_CHARS,
          currentCellSize,
          "contain",
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
    [renderGrid, track],
  );

  // Handle paste
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

  // Initialize canvas and attach listeners
  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const initializeGrid = async () => {
      await initGrid();
      renderGrid();
    };
    initializeGrid();

    window.addEventListener("resize", triggerResize);

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleDraw);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseleave", handleEnd);
    document.addEventListener("paste", handlePaste);

    // Touch events
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchmove", handleDraw);
    canvas.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("resize", triggerResize);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleDraw);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseleave", handleEnd);
      document.removeEventListener("paste", handlePaste);

      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleDraw);
      canvas.removeEventListener("touchend", handleEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clean up ImageBitmap
      if (sourceImageRef.current?.bitmap) {
        sourceImageRef.current.bitmap.close();
      }
    };
  }, []);

  // Handle symbol selection
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
      className={`hidden md:block absolute top-0 left-0 w-full h-screen overflow-hidden ${drawingMode ? "opacity-100 z-100" : "opacity-15 z-0"
        } transition-opacity duration-300`}
      role="button"
      tabIndex={drawingMode ? -1 : 0}
      onMouseDown={() => {
        if (!drawingMode) {
          handleToggleMode();
        }
      }}
      onKeyDown={(e) => {
        if (drawingMode && (e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          handleDownloadPng();
        }
      }}
    >
      <ResizingIndicator isResizing={isResizing} drawingMode={drawingMode} />

      <canvas
        ref={canvasRef}
        className={`inset-0 bg-background text-foreground-07 cursor-crosshair ${drawingMode ? "fixed" : "absolute"
          }`}
      />

      {drawingMode && (
        <div className="fixed top-4 right-4 left-4 flex justify-between p-2 gap-2 z-200 bg-foreground/10 text-foreground rounded-2xl backdrop-blur">
          <div className="flex gap-1 items-center flex-wrap">
            <NavButton text={style} onClick={handleStyleToggle} />
            <Divider vertical className="bg-foreground-07/20 mx-2" />
            <CellSizeSelector
              cellSize={cellSize}
              onCellSizeChange={debouncedCellSizeChange}
              style={style}
            />
            <Divider vertical className="bg-foreground-07/20 mx-2" />
            {/* <ColorModeToggle
              colorMode={colorMode}
              onToggle={handleColorModeToggle}
              disabled={!hasSourceImage}
            />
            <Divider vertical className="bg-foreground-05 mx-2" /> */}
            <div className="flex gap-1 h-full">
              <NavButton
                onClick={() => {
                  // In light mode, swap modes so visual behavior matches button label
                  setMode(theme === "light" ? "increment" : "decrement");
                }}
                isSelected={
                  drawingMode ===
                  (theme === "light" ? "increment" : "decrement")
                }
                text="Darken"
                icon={<Darken stroke={1} />}
              />
              <NavButton
                onClick={() => {
                  // In light mode, swap modes so visual behavior matches button label
                  setMode(theme === "light" ? "decrement" : "increment");
                }}
                isSelected={
                  drawingMode ===
                  (theme === "light" ? "decrement" : "increment")
                }
                text="Lighten"
                icon={<Lighten stroke={1} />}
              />
              <SymbolSelector
                selectedSymbol={selectedSymbol}
                onSelectSymbol={handleSelectSymbol}
                onModeSelect={() => setMode("brush")}
                isSelected={drawingMode === "brush"}
                style={style}
              />
            </div>
          </div>

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
