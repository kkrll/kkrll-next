import { memo } from "react";
import Divider from "../../Divider";
import ImageUploadButton from "./imageUploadButton";

interface DrawingControlsProps {
  onClear: () => void;
  onDownloadPng: () => void;
  onDownloadTxt: () => void;
  onExit: () => void;
  onImageUpload: (file: File) => void;
  isConverting: boolean;
}

const DrawingControls = memo(
  ({
    onClear,
    onDownloadPng,
    onDownloadTxt,
    onExit,
    onImageUpload,
    isConverting,
  }: DrawingControlsProps) => {
    return (
      <div className="flex gap-2 animate-[fadeIn_200ms_ease-in-out]">
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
        >
          Clear
        </button>
        <Divider vertical className="bg-foreground-05 mx-2" />
        <ImageUploadButton onImageSelected={onImageUpload} />
        {isConverting && (
          <div className="animate-[fadeIn_200ms_ease-in-out] text-xs text-foreground-05">
            Converting...
          </div>
        )}
        <Divider vertical className="bg-foreground-05 mx-2" />
        <button
          type="button"
          onClick={onDownloadPng}
          className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
        >
          Save as PNG
        </button>
        <button
          type="button"
          onClick={onDownloadTxt}
          className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
        >
          Save as TXT
        </button>
        <Divider vertical className="bg-foreground-05 mx-2" />
        <button
          type="button"
          onClick={onExit}
          className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
        >
          Exit
        </button>
      </div>
    );
  }
);

export default DrawingControls;
