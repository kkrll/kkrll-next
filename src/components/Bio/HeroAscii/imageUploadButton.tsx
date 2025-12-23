import { UploadPicture } from "@/components/ui/icons";
import { memo, useRef } from "react";
import NavButton from "./NavButton";

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
        <NavButton text="Upload image" onClick={handleClick} icon={<UploadPicture />} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </>
    );
  },
);

ImageUploadButton.displayName = "ImageUploadButton";

export default ImageUploadButton;
