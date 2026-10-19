import { useRef } from 'react';

type ImageUploadProps = {
  onImageUpload: (imageUrl: string) => void;
};

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded border border-[#3c3c3c] bg-[#2c2c2c] px-2 py-1 text-xs text-zinc-200 hover:bg-[#3c3c3c]"
      >
        Загрузить изображение
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};