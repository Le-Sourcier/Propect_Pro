import React, { useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewImage,
  onImageChange,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="mt-1 flex items-center space-x-4">
      <div
        className={`
          relative flex-shrink-0 h-16 w-16 rounded-full 
          ${previewImage ? "" : "bg-blue-50"} 
          flex items-center justify-center
          transition-all duration-300
          ${isHovering ? "ring-4 ring-blue-200" : ""}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile preview"
            className="h-16 w-16 rounded-full object-cover transition-transform duration-300 ease-in-out"
            style={{
              transform: isHovering ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <Upload
            className={`
              h-6 w-6 text-blue-400
              transition-all duration-300
              ${isHovering ? "text-blue-500" : ""}
            `}
          />
        )}

        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">Change</span>
          </div>
        )}
      </div>

      <label
        htmlFor="profile-image"
        className={`
          cursor-pointer bg-white py-2 px-3 border border-gray-300 
          rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 
          hover:bg-gray-50 focus:outline-none
          transition-all duration-300
          transform hover:-translate-y-0.5 active:translate-y-0
          hover:shadow-md
        `}
      >
        {previewImage ? "Change" : "Upload photo"}
        <input
          id="profile-image"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="sr-only"
        />
      </label>
    </div>
  );
};

export default ImageUploader;
