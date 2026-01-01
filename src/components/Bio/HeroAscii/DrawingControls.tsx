import { memo } from "react";
import Divider from "../../Divider";
import ImageControlsPopover from "./ImageControlsPopover";
import NavButton from "./NavButton";
import { CloseIcon } from "@/components/ui/icons";

interface DrawingControlsProps {
  onDownloadPng: () => void;
  onDownloadTxt: () => void;
  onExit: () => void;
  onImageUpload: (file: File) => void;
  onReset: () => void;
  isConverting: boolean;
  blackPoint: number;
  whitePoint: number;
  onBlackPointChange: (value: number) => void;
  onWhitePointChange: (value: number) => void;
}

const DrawingControls = memo(
  ({
    onDownloadPng,
    onDownloadTxt,
    onExit,
    onImageUpload,
    onReset,
    isConverting,
    blackPoint,
    whitePoint,
    onBlackPointChange,
    onWhitePointChange,
  }: DrawingControlsProps) => {
    return (
      <div className="flex gap-1 animate-[fadeIn_200ms_ease-in-out]">
        <ImageControlsPopover
          blackPoint={blackPoint}
          whitePoint={whitePoint}
          onBlackPointChange={onBlackPointChange}
          onWhitePointChange={onWhitePointChange}
          onImageUpload={onImageUpload}
          onReset={onReset}
          isConverting={isConverting}
        />
        <Divider vertical className="bg-foreground-07/20 mx-2" />
        <NavButton text="Save as PNG" onClick={onDownloadPng} />
        <NavButton text="Save as TXT" onClick={onDownloadTxt} />
        <Divider vertical className="bg-foreground-07/20 mx-2" />
        <NavButton text="Exit" onClick={onExit} icon={<CloseIcon />} />
      </div>
    );
  },
);

export default DrawingControls;
