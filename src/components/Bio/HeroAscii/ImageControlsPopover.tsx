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
import OffsetControl2D from "./OffsetControl2D";
import type { ColorMode } from "./types";

interface ImageControlsPopoverProps {
  blackPoint: number;
  whitePoint: number;
  onBlackPointChange: (value: number) => void;
  onWhitePointChange: (value: number) => void;
  onImageUpload: (file: File) => void;
  onReset: () => void;
  isConverting: boolean;
  bgBlur: number;
  bgScale: number;
  bgOffsetX: number;
  bgOffsetY: number;
  onBgBlurChange: (value: number) => void;
  onBgScaleChange: (value: number) => void;
  onBgOffsetChange: (x: number, y: number) => void;
  hasSourceImage: boolean;
  colorMode: ColorMode;
  onSetMixedMode: () => void;
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
    bgBlur,
    bgScale,
    bgOffsetX,
    bgOffsetY,
    onBgBlurChange,
    onBgScaleChange,
    onBgOffsetChange,
    hasSourceImage,
    colorMode,
    onSetMixedMode,
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

          {/* Background Image Section */}
          <div className="relative">
            {/* Blur Slider */}
            <div className="mb-4">
              <label
                htmlFor="bg-blur-slider"
                className="text-xs font-mono font-medium text-foreground-07 block mb-2"
              >
                Blur
              </label>
              <input
                id="bg-blur-slider"
                type="range"
                min={0}
                max={20}
                step={1}
                value={bgBlur}
                onChange={(e) => onBgBlurChange(Number(e.target.value))}
                className="w-full accent-foreground slider-tapered"
                disabled={!hasSourceImage}
              />
            </div>

            {/* Offset and Scale Controls - Side by Side */}
            <div className="mb-3">
              {/* Labels Row */}
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono font-medium text-foreground-07">
                  Offset
                </label>
                <label className="text-xs font-mono font-medium text-foreground-07">
                  {Math.round(bgScale * 100)}%
                </label>
              </div>

              {/* Controls Row */}
              <div className="flex gap-3 items-center">
                <OffsetControl2D
                  offsetX={bgOffsetX}
                  offsetY={bgOffsetY}
                  onChange={onBgOffsetChange}
                  disabled={!hasSourceImage}
                />

                {/* Vertical Scale Slider */}
                <div
                  className="relative"
                  style={{ width: 24, height: 120 }}
                >
                  <input
                    id="bg-scale-slider"
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={bgScale}
                    onChange={(e) => onBgScaleChange(Number(e.target.value))}
                    className="accent-foreground slider-vertical"
                    disabled={!hasSourceImage}
                  />
                </div>
              </div>
            </div>

            {/* Overlay when not in mixed mode */}
            {colorMode !== "mixed" && (
              <div className="absolute inset-0 bg-overlay backdrop-blur-sm border-background-05 border-1 rounded-lg flex flex-col items-center justify-center gap-3 p-4">
                <p className="text-xs font-mono text-center text-foreground-07">
                  Image is not displayed in this mode
                </p>
                <button
                  type="button"
                  onClick={onSetMixedMode}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer py-2 text-xs font-mono text-foreground rounded-xl bg-background-07 hover:bg-background-05 mb-3"
                >
                  Mixed mode
                </button>
              </div>
            )}
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
