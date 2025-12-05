import { memo } from "react";
import Divider from "../../Divider";
import ImageUploadButton from "./imageUploadButton";
import NavButton from "./NavButton";

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
        <NavButton text="Clear" onClick={onClear} />
        <Divider vertical className="bg-foreground-05 mx-2" />
        <ImageUploadButton onImageSelected={onImageUpload} />
        {isConverting && (
          <div className="animate-[fadeIn_200ms_ease-in-out] text-xs text-foreground-05">
            Converting...
          </div>
        )}
        <Divider vertical className="bg-foreground-05 mx-2" />
        <NavButton text="Save as PNG" onClick={onDownloadPng} />
        <NavButton text="Save as TXT" onClick={onDownloadTxt} />
        <Divider vertical className="bg-foreground-05 mx-2" />
        <NavButton text="Exit" onClick={onExit} />
      </div>
    );
  },
);

export default DrawingControls;
