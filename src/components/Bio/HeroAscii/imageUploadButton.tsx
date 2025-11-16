import { memo, useRef } from "react";

interface ImageUploadButtonProps {
  onImageSelected: (file: File) => void;
}

const ImageUploadButton = memo(
  ({ onImageSelected }: ImageUploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelected(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className="px-3 py-1 text-xs font-mono bg-background/30 hover:bg-background/70 text-foreground rounded transition-colors"
        >
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </>
    );
  }
);

ImageUploadButton.displayName = "ImageUploadButton";

export default ImageUploadButton;
