import type { CharCell } from "./types";
import { CHAR_WIDTH, CHAR_HEIGHT } from "./constants";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function convertImageToGrid(
  file: File,
  cols: number,
  rows: number,
  asciiChars: string[]
): Promise<CharCell[]> {
  try {
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size is too large");
    }

    const img = await loadImage(file);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cols;
    tempCanvas.height = rows;

    const ctx = tempCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Calculate aspect ratios (accounting for character physical dimensions)
    const imgAspect = img.width / img.height;
    const canvasAspect = (cols * CHAR_WIDTH) / (rows * CHAR_HEIGHT);

    let drawWidth = cols;
    let drawHeight = rows;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      drawHeight = Math.round((cols * CHAR_WIDTH) / (imgAspect * CHAR_HEIGHT));
      offsetY = Math.round((rows - drawHeight) / 2);
    } else {
      drawWidth = Math.round((rows * CHAR_HEIGHT * imgAspect) / CHAR_WIDTH);
      offsetX = Math.round((cols - drawWidth) / 2);
    }

    ctx.drawImage(
      img as CanvasImageSource,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
    const imageData = ctx.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      const normalized = luminance / 255;
      const contrast = 2; // Adjust this value to control contrast strength (1-3 recommended)
      const adjusted = normalized ** (1 / contrast);
      const final = Math.round(adjusted * 255);

      data[i] = final;
      data[i + 1] = final;
      data[i + 2] = final;
    }

    ctx.putImageData(imageData, 0, 0);

    const grid: CharCell[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i]; // Now all RGB channels are equal (monochrome)
      let level = Math.floor((gray / 255) * (asciiChars.length - 1));
      level = Math.max(0, Math.min(level, asciiChars.length - 1));
      const index = Math.floor(i / 4);
      const col = index % cols;
      const row = Math.floor(index / cols);

      grid.push({
        baseLevel: level,
        currentLevel: level,
        col,
        row,
      });
    }
    return grid;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to convert the image";
    throw new Error(message);
  }
}

export default convertImageToGrid;
