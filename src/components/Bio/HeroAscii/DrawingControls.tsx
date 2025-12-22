import { memo } from "react";
import Divider from "../../Divider";
import ImageUploadButton from "./imageUploadButton";
import NavButton from "./NavButton";
import { CloseIcon } from "@/components/ui/icons";

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
      <div className="flex gap-1 animate-[fadeIn_200ms_ease-in-out]">
        <ImageUploadButton onImageSelected={onImageUpload} />
        {isConverting && (
          <div className="animate-[fadeIn_200ms_ease-in-out] text-xs text-foreground-05">
            Converting...
          </div>
        )}
        <Divider vertical className="bg-foreground-07/20 mx-2" />
        <NavButton text="Save as PNG" onClick={onDownloadPng} />
        <NavButton text="Save as TXT" onClick={onDownloadTxt} />
        <Divider vertical className="bg-foreground-07/20 mx-2" />
        <NavButton text="Clear" onClick={onClear} />
        <NavButton text="Exit" onClick={onExit} icon={<CloseIcon />} />
      </div>
    );
  },
);

export default DrawingControls;
