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
  IMAGE_ASCII_CHARS,
  STYLES,
  getFontForCellSize,
} from "./constants";
import type {
  CellSize,
  CellSizeRange,
  ColorCharCell,
  ColorMode,
  Colors,
  EditOverlay,
  FitMode,
  SourceImage,
  RenderStyle,
  DrawingModes,
  VariableCellDimensions,
} from "./types";
import SymbolSelector from "./SymbolSelector";
import PaletteColorPicker from "./PaletteColorPicker";
import DrawingControls from "./DrawingControls";
import ResizingIndicator from "./ResizingIndicator";
import { useThemeStore } from "@/stores/useThemeStore";
import convertImageToGrid, { convertBitmapToGrid } from "./imageToAscii";
import { generateAsciiTxt, uploadAsciiToR2 } from "./asciiSavingUtils";
import NavButton from "./NavButton";
import Divider from "@/components/Divider";
import {
  renderCell,
  mapLevel,
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
import { Darken, Eraser, Lighten } from "@/components/ui/icons";
import {
  generateVariableDimensions,
  findColumnAtX,
  findRowAtY,
  DEFAULT_CELL_SIZE_RANGE,
} from "./variableDimensions";

export default function HeroAscii({
  drawingMode,
  onToggleDrawingMode,
  setMode,
}: {
  drawingMode: DrawingModes;
  onToggleDrawingMode: () => void;
  setMode: (mode: DrawingModes) => void;
}) {
  // Canvas and grid refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
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
  const selectedPaletteColorRef = useRef("#000000");
  const drawingModeRef = useRef(drawingMode);
  const lastDrawnCellRef = useRef<{ row: number; col: number } | null>(null);
  const blackPointRef = useRef(0);
  const whitePointRef = useRef(1);
  const bgOffsetRef = useRef({
    x: 0,
    y: 0,
    originalWidth: 0,
    originalHeight: 0,
  });
  const bgBlurRef = useRef(4);
  const bgScaleRef = useRef(1);

  // Render settings ref (avoid re-renders when settings change)
  const renderSettingsRef = useRef<RenderSettings>(
    createDefaultRenderSettings(),
  );

  // UI State
  const [selectedSymbol, setSelectedSymbol] = useState(8);
  const [selectedPaletteColor, setSelectedPaletteColor] = useState("#000000");
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState(false);
  const [style, setStyle] = useState<RenderStyle>("Ascii");
  const [cellSize, setCellSize] = useState<CellSize>({
    width: DEFAULT_CELL_WIDTH,
    height: DEFAULT_CELL_HEIGHT,
  });
  const [cellSizeRange, setCellSizeRange] = useState<CellSizeRange>(
    DEFAULT_CELL_SIZE_RANGE
  );
  // Variable dimensions for Palette mode (null = use uniform cellSize)
  const variableDimensionsRef = useRef<VariableCellDimensions | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("monochrome");
  const [hasSourceImage, setHasSourceImage] = useState(false);
  const [blackPoint, setBlackPoint] = useState(0);
  const [whitePoint, setWhitePoint] = useState(1);
  const [bgBlur, setBgBlur] = useState(4);
  const [bgScale, setBgScale] = useState(1);
  const [bgOffsetX, setBgOffsetX] = useState(0);
  const [bgOffsetY, setBgOffsetY] = useState(0);

  const { track } = useTracking();
  const theme = useThemeStore((state) => state.theme);

  // Sync refs with state
  useEffect(() => {
    selectedSymbolRef.current = selectedSymbol;
  }, [selectedSymbol]);

  useEffect(() => {
    selectedPaletteColorRef.current = selectedPaletteColor;
  }, [selectedPaletteColor]);

  useEffect(() => {
    drawingModeRef.current = drawingMode;
  }, [drawingMode]);

  // Background canvas
  const drawBackground = useCallback(() => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;

    const ctx = bgCanvas.getContext("2d");
    if (!ctx) return;

    const colors = colorsRef.current;
    const currentColorMode = renderSettingsRef.current.colorMode;

    if (currentColorMode === "mixed" && sourceImageRef.current) {
      // Draw blurred source image
      const { bitmap, width: srcW, height: srcH } = sourceImageRef.current;
      const originalCanvasW = bgOffsetRef.current.originalWidth;
      const originalCanvasH = bgOffsetRef.current.originalHeight;

      // Calculate fit (same as imageToAscii)
      let dx: number, dy: number, dw: number, dh: number;

      if (fitModeRef.current === "cover") {
        const scale = Math.max(originalCanvasW / srcW, originalCanvasH / srcH);
        dw = srcW * scale;
        dh = srcH * scale;
        dx = (originalCanvasW - dw) / 2;
        dy = (originalCanvasH - dh) / 2;
      } else {
        const scale = Math.min(originalCanvasW / srcW, originalCanvasH / srcH);
        dw = srcW * scale;
        dh = srcH * scale;
        dx = (originalCanvasW - dw) / 2;
        dy = (originalCanvasH - dh) / 2;
      }

      // Apply user scale
      dw *= bgScaleRef.current;
      dh *= bgScaleRef.current;

      // Recenter after scaling
      dx = (originalCanvasW - dw) / 2;
      dy = (originalCanvasH - dh) / 2;

      dx += bgOffsetRef.current.x;
      dy += bgOffsetRef.current.y;

      // Clear and draw with blur
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.filter = `blur(${bgBlurRef.current}px)`;
      ctx.drawImage(bitmap, dx, dy, dw, dh);
      ctx.filter = "none";
    } else {
      // Solid color background
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    }
  }, []);

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

      bgOffsetRef.current = {
        x: 0,
        y: 0,
        originalWidth: canvas.width,
        originalHeight: canvas.height,
      };
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
        blackPointRef.current,
        whitePointRef.current,
        renderSettingsRef.current.invert,
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
    const varDims = variableDimensionsRef.current;
    const isPaletteWithVarDims =
      renderSettingsRef.current.style === "Palette" && varDims !== null;

    drawBackground();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = getFontForCellSize(currentCellSize.height);
    ctx.textBaseline = "top";

    gridRef.current.forEach((cell) => {
      let x: number;
      let y: number;
      let cellSizeOverride: CellSize | undefined;

      if (isPaletteWithVarDims) {
        // Variable dimensions: use per-column/per-row sizes
        x = varDims.columnOffsets[cell.col];
        y = varDims.rowOffsets[cell.row];
        cellSizeOverride = {
          width: varDims.columnWidths[cell.col],
          height: varDims.rowHeights[cell.row],
        };
      } else {
        // Uniform dimensions
        x = cell.col * currentCellSize.width;
        y = cell.row * currentCellSize.height;
      }

      renderCell(
        ctx,
        cell,
        renderSettingsRef.current,
        x,
        y,
        asciiCharsDrawRef.current,
        colors,
        cellSizeOverride,
      );
    });
  }, [updateColors, drawBackground]);

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
    (newCellSize: CellSize) => {
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
        const newGrid = convertBitmapToGrid(
          sourceImageRef.current.bitmap,
          cols,
          rows,
          IMAGE_ASCII_CHARS,
          newCellSize,
          fitModeRef.current,
          blackPointRef.current,
          whitePointRef.current,
          renderSettingsRef.current.invert,
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
  const debouncedCellSizeChange = useDebounce(handleCellSizeChange, 100);

  // Generate grid with variable cell dimensions (Palette mode)
  const generateGridWithVariableDimensions = useCallback(
    (varDims: VariableCellDimensions) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const cols = varDims.columnWidths.length;
      const rows = varDims.rowHeights.length;

      if (sourceImageRef.current) {
        // Create temp canvas to sample from source image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Draw source image to temp canvas with fit logic
        const { bitmap, width: srcW, height: srcH } = sourceImageRef.current;
        let dx: number, dy: number, dw: number, dh: number;

        if (fitModeRef.current === "cover") {
          const scale = Math.max(canvas.width / srcW, canvas.height / srcH);
          dw = srcW * scale;
          dh = srcH * scale;
          dx = (canvas.width - dw) / 2;
          dy = (canvas.height - dh) / 2;
        } else {
          const scale = Math.min(canvas.width / srcW, canvas.height / srcH);
          dw = srcW * scale;
          dh = srcH * scale;
          dx = (canvas.width - dw) / 2;
          dy = (canvas.height - dh) / 2;
        }

        tempCtx.drawImage(bitmap, dx, dy, dw, dh);
        const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Create grid by sampling center of each variable-sized cell
        const newGrid: ColorCharCell[] = new Array(cols * rows);
        const maxLevel = IMAGE_ASCII_CHARS.length - 1;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const cellX = varDims.columnOffsets[col];
            const cellY = varDims.rowOffsets[row];
            const cellW = varDims.columnWidths[col];
            const cellH = varDims.rowHeights[row];

            // Sample center pixel of this cell
            const centerX = Math.floor(cellX + cellW / 2);
            const centerY = Math.floor(cellY + cellH / 2);
            const pixelIndex = (centerY * canvas.width + centerX) * 4;

            const r = pixels[pixelIndex] || 0;
            const g = pixels[pixelIndex + 1] || 0;
            const b = pixels[pixelIndex + 2] || 0;
            const a = pixels[pixelIndex + 3] || 255;

            // Calculate luminance and level
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const normalized = luminance / 255;
            let level = Math.floor(normalized * maxLevel);

            // Apply inversion for light mode
            if (renderSettingsRef.current.invert) {
              level = maxLevel - level;
            }

            newGrid[row * cols + col] = {
              baseLevel: level,
              currentLevel: level,
              col,
              row,
              r,
              g,
              b,
              isTransparent: a < 56,
            };
          }
        }

        gridRef.current = newGrid;
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
    },
    [],
  );

  // Handle shuffle button - regenerate random dimensions
  const handleShuffleDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || renderSettingsRef.current.style !== "Palette") return;

    setIsResizing(true);

    // Generate new random dimensions
    const varDims = generateVariableDimensions(
      canvas.width,
      canvas.height,
      cellSizeRange
    );
    variableDimensionsRef.current = varDims;

    // Regenerate grid with new dimensions
    generateGridWithVariableDimensions(varDims);

    renderGrid();
    setIsResizing(false);

    track("ascii_dimensions_shuffled", {
      cols: varDims.columnWidths.length,
      rows: varDims.rowHeights.length,
    });
  }, [cellSizeRange, generateGridWithVariableDimensions, renderGrid, track]);

  // Handle cell size range change (Palette mode)
  const handleCellSizeRangeChange = useCallback(
    (newRange: CellSizeRange) => {
      setCellSizeRange(newRange);

      const canvas = canvasRef.current;
      if (!canvas || renderSettingsRef.current.style !== "Palette") return;

      setIsResizing(true);

      // Generate new dimensions with updated range
      const varDims = generateVariableDimensions(
        canvas.width,
        canvas.height,
        newRange
      );
      variableDimensionsRef.current = varDims;

      // Regenerate grid
      generateGridWithVariableDimensions(varDims);

      renderGrid();
      setIsResizing(false);
    },
    [generateGridWithVariableDimensions, renderGrid],
  );

  // Debounced range change for sliders/inputs
  const debouncedCellSizeRangeChange = useDebounce(handleCellSizeRangeChange, 200);

  // Handle color mode toggle
  const handleColorModeToggle = useCallback(() => {
    const modes: ColorMode[] = ["monochrome", "original", "mixed"];
    const currentIndex = modes.indexOf(colorMode);
    const newMode = modes[(currentIndex + 1) % modes.length];

    setColorMode(newMode);
    renderSettingsRef.current.colorMode = newMode;
    renderGrid();

    track("ascii_color_mode_changed", { color_mode: newMode });
  }, [colorMode, renderGrid, track]);

  // Handle setting mixed mode directly
  const handleSetMixedMode = useCallback(() => {
    setColorMode("mixed");
    renderSettingsRef.current.colorMode = "mixed";
    renderGrid();

    track("ascii_color_mode_changed", { color_mode: "mixed" });
  }, [renderGrid, track]);

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

      bgOffsetRef.current.x += colOffset * currentCellSize.width;
      bgOffsetRef.current.y += rowOffset * currentCellSize.height;
      setBgOffsetX(bgOffsetRef.current.x);
      setBgOffsetY(bgOffsetRef.current.y);

      const newGrid: ColorCharCell[] = new Array(newCols * newRows);

      const maxLevel = asciiCharsDrawRef.current.length - 1;
      const blankLevel = mapLevel(0, maxLevel, renderSettingsRef.current.invert);

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
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

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
    bgCanvas.width = newWidth;
    bgCanvas.height = newHeight;

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
      const colors = colorsRef.current;
      const varDims = variableDimensionsRef.current;
      const isPaletteWithVarDims =
        renderSettingsRef.current.style === "Palette" && varDims !== null;

      let x: number;
      let y: number;
      let cellW: number;
      let cellH: number;
      let cellSizeOverride: CellSize | undefined;

      if (isPaletteWithVarDims) {
        // Variable dimensions: use per-column/per-row sizes
        x = varDims.columnOffsets[cell.col];
        y = varDims.rowOffsets[cell.row];
        cellW = varDims.columnWidths[cell.col];
        cellH = varDims.rowHeights[cell.row];
        cellSizeOverride = { width: cellW, height: cellH };
      } else {
        // Uniform dimensions
        const currentCellSize = renderSettingsRef.current.cellSize;
        x = cell.col * currentCellSize.width;
        y = cell.row * currentCellSize.height;
        cellW = currentCellSize.width;
        cellH = currentCellSize.height;
      }

      // Clear cell area before redrawing
      ctx.clearRect(x, y, cellW, cellH);

      // If erasing (transparent), copy from background canvas
      if (cell.isTransparent && bgCanvasRef.current) {
        const bgCtx = bgCanvasRef.current.getContext("2d");
        if (bgCtx) {
          ctx.drawImage(
            bgCanvasRef.current,
            x, y, cellW, cellH,
            x, y, cellW, cellH
          );
        }
      } else {
        // Use shared rendering logic
        renderCell(
          ctx,
          cell,
          renderSettingsRef.current,
          x,
          y,
          asciiCharsDrawRef.current,
          colors,
          cellSizeOverride,
        );
      }
    },
    [],
  );

  // Get cell at mouse/touch position
  const getCellAtPosition = useCallback(
    (canvas: HTMLCanvasElement, x: number, y: number) => {
      const varDims = variableDimensionsRef.current;
      const isPaletteWithVarDims =
        renderSettingsRef.current.style === "Palette" && varDims !== null;

      let col: number;
      let row: number;
      let cols: number;
      let rows: number;

      if (isPaletteWithVarDims) {
        // Variable dimensions: use binary search
        col = findColumnAtX(x, varDims.columnOffsets);
        row = findRowAtY(y, varDims.rowOffsets);
        cols = varDims.columnWidths.length;
        rows = varDims.rowHeights.length;
      } else {
        // Uniform dimensions: simple division
        const currentCellSize = renderSettingsRef.current.cellSize;
        col = Math.floor(x / currentCellSize.width);
        row = Math.floor(y / currentCellSize.height);
        cols = Math.ceil(canvas.width / currentCellSize.width);
        rows = Math.ceil(canvas.height / currentCellSize.height);
      }

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
            const maxLevel = asciiCharsDrawRef.current.length - 1;

            switch (mode) {
              case "brush":
                if (renderSettingsRef.current.style === "Palette" && renderSettingsRef.current.colorMode !== "monochrome") {
                  // Palette mode with color
                  const hex = selectedPaletteColorRef.current;
                  const r = Number.parseInt(hex.slice(1, 3), 16);
                  const g = Number.parseInt(hex.slice(3, 5), 16);
                  const b = Number.parseInt(hex.slice(5, 7), 16);

                  // Set RGB values if cell supports color data
                  if ("r" in cell && "g" in cell && "b" in cell) {
                    cell.r = r;
                    cell.g = g;
                    cell.b = b;
                    cell.currentLevel = maxLevel; // Full opacity
                  }
                  cell.isTransparent = false;
                } else {
                  // Ascii/Dot mode: Pre-invert so render-time mapLevel produces the displayed symbol
                  cell.currentLevel = mapLevel(
                    selectedSymbolRef.current,
                    maxLevel,
                    renderSettingsRef.current.invert,
                  );
                  cell.isTransparent = false;
                }
                break;
              case "increment":
                cell.isTransparent = false;
                // In Palette mode with original/mixed, only adjust color brightness
                if (renderSettingsRef.current.style === "Palette" && renderSettingsRef.current.colorMode !== "monochrome" && "r" in cell) {
                  cell.r = Math.min(cell.r + 10, 255);
                  cell.g = Math.min(cell.g + 10, 255);
                  cell.b = Math.min(cell.b + 10, 255);
                } else {
                  cell.currentLevel = Math.min(cell.currentLevel + 1, maxLevel);
                }
                break;
              case "decrement":
                cell.isTransparent = false;
                // In Palette mode with original/mixed, only adjust color brightness
                if (renderSettingsRef.current.style === "Palette" && renderSettingsRef.current.colorMode !== "monochrome" && "r" in cell) {
                  cell.r = Math.max(cell.r - 10, 0);
                  cell.g = Math.max(cell.g - 10, 0);
                  cell.b = Math.max(cell.b - 10, 0);
                } else {
                  cell.currentLevel = Math.max(cell.currentLevel - 1, 0);
                }
                break;
              case "eraser":
                // Set cell to transparent
                cell.isTransparent = true;
                cell.currentLevel = renderSettingsRef.current.invert ? maxLevel : 0;
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
                    mode === "brush"
                      ? mapLevel(
                        selectedSymbolRef.current,
                        maxLevel,
                        renderSettingsRef.current.invert,
                      )
                      : undefined,
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
            ctx.font = getFontForCellSize(currentCellSize.height);
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

  // Handle contrast change - regenerates grid with new black/white points
  const handleContrastChange = useCallback(
    (newBlackPoint: number, newWhitePoint: number) => {
      blackPointRef.current = newBlackPoint;
      whitePointRef.current = newWhitePoint;
      setBlackPoint(newBlackPoint);
      setWhitePoint(newWhitePoint);

      track("ascii_contrast_changed", {
        black_point: newBlackPoint,
        white_point: newWhitePoint,
      });

      if (!sourceImageRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentCellSize = renderSettingsRef.current.cellSize;
      const cols = Math.ceil(canvas.width / currentCellSize.width);
      const rows = Math.ceil(canvas.height / currentCellSize.height);
      const newGrid = convertBitmapToGrid(
        sourceImageRef.current.bitmap,
        cols,
        rows,
        IMAGE_ASCII_CHARS,
        currentCellSize,
        fitModeRef.current,
        newBlackPoint,
        newWhitePoint,
        renderSettingsRef.current.invert,
      );

      // Apply edits from overlay
      const overlay = editOverlayRef.current;
      if (overlay) {
        newGrid.forEach((cell) => {
          const edit = sampleEditsForCell(
            overlay,
            cell.col,
            cell.row,
            currentCellSize,
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
      renderGrid();
    },
    [renderGrid, track],
  );

  const debouncedContrastChange = useDebounce(handleContrastChange, 100);

  // Handle background blur change
  const handleBgBlurChange = useCallback(
    (value: number) => {
      bgBlurRef.current = value;
      setBgBlur(value);
      drawBackground();
      track("ascii_bg_blur_changed", { blur: value });
    },
    [drawBackground, track],
  );

  // Handle background scale change
  const handleBgScaleChange = useCallback(
    (value: number) => {
      bgScaleRef.current = value;
      setBgScale(value);
      drawBackground();
      track("ascii_bg_scale_changed", { scale: value });
    },
    [drawBackground, track],
  );

  // Handle background offset change
  const handleBgOffsetChange = useCallback(
    (x: number, y: number) => {
      bgOffsetRef.current.x = x;
      bgOffsetRef.current.y = y;
      setBgOffsetX(x);
      setBgOffsetY(y);
      drawBackground();
      track("ascii_bg_offset_changed", {
        offset_x: x,
        offset_y: y,
      });
    },
    [drawBackground, track],
  );

  // Handle reset - reset to base levels, clear edits, and reset contrast
  const handleReset = useCallback(() => {
    track("ascii_canvas_cleared");

    // Reset contrast to defaults
    blackPointRef.current = 0;
    whitePointRef.current = 1;
    setBlackPoint(0);
    setWhitePoint(1);

    // Reset background controls to defaults
    bgBlurRef.current = 4;
    bgScaleRef.current = 1;
    bgOffsetRef.current.x = 0;
    bgOffsetRef.current.y = 0;
    setBgBlur(4);
    setBgScale(1);
    setBgOffsetX(0);
    setBgOffsetY(0);

    gridRef.current.forEach((cell) => {
      cell.currentLevel = cell.baseLevel;
    });

    // Clear edit overlay
    if (editOverlayRef.current) {
      clearOverlay(editOverlayRef.current);
    }

    // Regenerate grid with default contrast if source image exists
    if (sourceImageRef.current) {
      handleContrastChange(0, 1);
    } else {
      renderGrid();
    }
  }, [renderGrid, track, handleContrastChange]);

  // Handle clear - remove image and all symbols, empty canvas
  const handleClear = useCallback(() => {
    track("ascii_canvas_cleared");

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Close and clear source image
    if (sourceImageRef.current?.bitmap) {
      sourceImageRef.current.bitmap.close();
    }
    sourceImageRef.current = null;
    setHasSourceImage(false);

    // Reset contrast to defaults
    blackPointRef.current = 0;
    whitePointRef.current = 1;
    setBlackPoint(0);
    setWhitePoint(1);

    // Clear edit overlay
    if (editOverlayRef.current) {
      clearOverlay(editOverlayRef.current);
    }

    // Create blank grid
    const currentCellSize = renderSettingsRef.current.cellSize;
    const cols = Math.ceil(canvas.width / currentCellSize.width);
    const rows = Math.ceil(canvas.height / currentCellSize.height);
    const maxLevel = IMAGE_ASCII_CHARS.length - 1;
    const blankLevel = mapLevel(0, maxLevel, renderSettingsRef.current.invert);

    const blankGrid: ColorCharCell[] = new Array(cols * rows);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        blankGrid[row * cols + col] = {
          baseLevel: blankLevel,
          currentLevel: blankLevel,
          row,
          col,
          r: 0,
          g: 0,
          b: 0,
        };
      }
    }
    gridRef.current = blankGrid;

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
    const canvas = canvasRef.current;
    const newStyle =
      STYLES.indexOf(style) === STYLES.length - 1
        ? STYLES[0]
        : STYLES[STYLES.indexOf(style) + 1];

    setStyle(newStyle);

    track("ascii_style_changed", { style: newStyle });

    if (newStyle === "Palette" && canvas) {
      // Initialize variable dimensions for Palette mode
      const varDims = generateVariableDimensions(
        canvas.width,
        canvas.height,
        cellSizeRange
      );
      variableDimensionsRef.current = varDims;
      generateGridWithVariableDimensions(varDims);
      renderGrid();
    } else {
      // Clear variable dimensions for other modes
      variableDimensionsRef.current = null;

      // Adjust cell size for new style
      const newCellSize = adjustCellSizeForStyle(cellSize, newStyle);
      if (
        newCellSize.width !== cellSize.width ||
        newCellSize.height !== cellSize.height
      ) {
        debouncedCellSizeChange(newCellSize);
      }
    }
  }, [style, cellSize, cellSizeRange, debouncedCellSizeChange, generateGridWithVariableDimensions, renderGrid, track]);

  // Handle download PNG
  const handleDownloadPng = useCallback(async () => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    track("ascii_saved_as_png");

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCtx.drawImage(bgCanvas, 0, 0);
    exportCtx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob(async (blob) => {
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
          blackPointRef.current,
          whitePointRef.current,
          renderSettingsRef.current.invert,
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
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

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

  // Handle palette color selection
  const handleSelectPaletteColor = useCallback(
    (color: string) => {
      track("ascii_palette_color_changed", { color });
      setSelectedPaletteColor(color);
    },
    [track],
  );

  // Handle drawing mode selection
  const handleModeSelect = useCallback(
    (mode: "brush" | "increment" | "decrement" | "eraser") => {
      track("ascii_drawing_mode_selected", { mode });
      setMode(mode);
    },
    [track, setMode],
  );

  return (
    <>
      {drawingMode && (
        <div
          className={`flex flex-col text-center p-8 font-mono text-sm items-center justify-center md:hidden absolute top-0 left-0 w-full h-screen overflow-hidden ${drawingMode ? "opacity-100 z-100" : "opacity-15 z-0"}`}
        >
          <p>
            There's quiet a nice drawing tool on this website, but atm it's only
            available on the desktop.
          </p>
          <p className="my-6">See you there.</p>
          <button
            type="button"
            onClick={() => {
              setMode(null);
            }}
            className="nice-button"
          >
            <span>back to the website</span>
          </button>
        </div>
      )}
      {/*biome-ignore lint/a11y/useSemanticElements: Full-screen interactive canvas container*/}
      <div
        className={`hidden md:block absolute top-0 left-0 w-full h-screen overflow-hidden ${!drawingMode
          ? renderSettingsRef.current.invert
            ? "opacity-[7%] z-0"
            : "opacity-15 z-0"
          : "opacity-100 z-100"
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
          ref={bgCanvasRef}
          className={`inset-0 ${drawingMode ? "fixed" : "absolute"} bg-background text-foreground-07`}
        />
        <canvas
          ref={canvasRef}
          className={`inset-0 cursor-crosshair ${drawingMode ? "fixed" : "absolute"}`}
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
                cellSizeRange={cellSizeRange}
                onCellSizeRangeChange={debouncedCellSizeRangeChange}
                onShuffle={handleShuffleDimensions}
              />
              <Divider vertical className="bg-foreground-07/20 mx-2" />
              <ColorModeToggle
                colorMode={colorMode}
                onToggle={handleColorModeToggle}
                disabled={!hasSourceImage}
              />
              <Divider vertical className="bg-foreground-05 mx-2" />
              <div className="flex gap-1 h-full">
                <NavButton
                  onClick={() => {
                    // In light mode, swap modes so visual behavior matches button label
                    handleModeSelect(
                      theme === "light" ? "increment" : "decrement",
                    );
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
                    handleModeSelect(
                      theme === "light" ? "decrement" : "increment",
                    );
                  }}
                  isSelected={
                    drawingMode ===
                    (theme === "light" ? "decrement" : "increment")
                  }
                  text="Lighten"
                  icon={<Lighten stroke={1} />}
                />
                <NavButton
                  onClick={() => handleModeSelect("eraser")}
                  isSelected={drawingMode === "eraser"}
                  text="Eraser"
                  icon={<Eraser stroke={1} />}
                />
                {style === "Palette" && colorMode !== "monochrome" ? (
                  <PaletteColorPicker
                    selectedColor={selectedPaletteColor}
                    onSelectColor={handleSelectPaletteColor}
                    onModeSelect={() => handleModeSelect("brush")}
                    isSelected={drawingMode === "brush"}
                  />
                ) : (
                  <SymbolSelector
                    selectedSymbol={selectedSymbol}
                    onSelectSymbol={handleSelectSymbol}
                    onModeSelect={() => handleModeSelect("brush")}
                    isSelected={drawingMode === "brush"}
                    style={style}
                  />
                )}
              </div>
            </div>

            <DrawingControls
              onDownloadPng={handleDownloadPng}
              onDownloadTxt={handleDownloadTxt}
              onExit={handleToggleMode}
              onImageUpload={handleImageUpload}
              onReset={handleReset}
              onClear={handleClear}
              isConverting={isConverting}
              blackPoint={blackPoint}
              whitePoint={whitePoint}
              onBlackPointChange={(v) =>
                debouncedContrastChange(v, whitePointRef.current)
              }
              onWhitePointChange={(v) =>
                debouncedContrastChange(blackPointRef.current, v)
              }
              bgBlur={bgBlur}
              bgScale={bgScale}
              bgOffsetX={bgOffsetX}
              bgOffsetY={bgOffsetY}
              onBgBlurChange={handleBgBlurChange}
              onBgScaleChange={handleBgScaleChange}
              onBgOffsetChange={handleBgOffsetChange}
              hasSourceImage={hasSourceImage}
              colorMode={colorMode}
              onSetMixedMode={handleSetMixedMode}
            />
          </div>
        )}
      </div>
    </>
  );
}
