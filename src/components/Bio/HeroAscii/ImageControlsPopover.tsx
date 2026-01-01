/**
 * Image Controls Popover Component
 *
 * A popover control for:
 * - Uploading images
 * - Adjusting black point (what's considered black)
 * - Adjusting white point (what's considered white)
 * - Resetting canvas to base state
 */

import { memo, useRef } from "react";
import { UploadPicture } from "@/components/ui/icons";
import "./styles.css";
import Divider from "@/components/Divider";
import NavButton from "./NavButton";

interface ImageControlsPopoverProps {
  blackPoint: number;
  whitePoint: number;
  onBlackPointChange: (value: number) => void;
  onWhitePointChange: (value: number) => void;
  onImageUpload: (file: File) => void;
  onReset: () => void;
  isConverting: boolean;
}

const ImageControlsPopover = memo(
  ({
    blackPoint,
    whitePoint,
    onBlackPointChange,
    onWhitePointChange,
    onImageUpload,
    onReset,
    isConverting,
  }: ImageControlsPopoverProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageUpload(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="h-full">
        <NavButton
          popoverTarget="image-controls"
          text="Image controls"
          className="anchor-image-controls"
          icon={<UploadPicture stroke={1} />}
          onClick={() => { }}
        />

        <div
          className="image-controls-popover p-3 bg-background border border-foreground/20 rounded-2xl shadow-lg min-w-48"
          popover=""
          id="image-controls"
        >
          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="w-full flex items-center justify-center gap-2 cursor-pointer py-2 text-xs font-mono text-foreground rounded-xl bg-background-07 hover:bg-background-05 mb-3"
          >
            {isConverting ? "Converting..." : "Upload image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <Divider className="bg-foreground-05/50 my-3" />

          {/* Black Point Slider */}
          <div className="mb-4">
            <label
              htmlFor="black-point-slider"
              className="text-xs font-mono font-medium text-foreground-07 block mb-2"
            >
              Black point
            </label>
            <input
              id="black-point-slider"
              type="range"
              min={0}
              max={50}
              value={Math.round(blackPoint * 100)}
              onChange={(e) => onBlackPointChange(Number(e.target.value) / 100)}
              className="w-full accent-foreground slider-tapered"
            />
          </div>

          {/* White Point Slider */}
          <div className="mb-3">
            <label
              htmlFor="white-point-slider"
              className="text-xs font-mono font-medium text-foreground-07 block mb-2"
            >
              White point
            </label>
            <input
              id="white-point-slider"
              type="range"
              min={50}
              max={100}
              value={Math.round(whitePoint * 100)}
              onChange={(e) => onWhitePointChange(Number(e.target.value) / 100)}
              className="w-full accent-foreground slider-tapered"
            />
          </div>

          <Divider className="bg-foreground-05/50 my-3" />

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center cursor-pointer py-2 text-xs font-mono text-foreground rounded-xl bg-background/30 hover:bg-background/70"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
);

ImageControlsPopover.displayName = "ImageControlsPopover";

export default ImageControlsPopover;
