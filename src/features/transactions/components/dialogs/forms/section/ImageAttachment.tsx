import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

interface ImageAttachmentProps {
  value: File | string | null;
  onChange: (value: File | string | null) => void;
}

export const ImageAttachment = ({ value, onChange }: ImageAttachmentProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isExistingImage =
    value && typeof value === "string" && !value.startsWith("data:");

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(typeof value === "string" ? value : null);
  }, [value]);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Attachment</FormLabel>
      <FormControl>
        <div className="relative border rounded p-3 bg-card">
          <div className="flex items-start gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Attachment preview"
                className="h-16 w-16 sm:w-[85px] sm:h-[85px] object-cover rounded flex-shrink-0"
              />
            ) : (
              <div className="w-[85px] h-[85px] flex-shrink-0 flex items-center justify-center border rounded text-center text-xs text-muted-foreground">
                No image
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {isExistingImage ? "Current image" : "Upload image"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isExistingImage
                  ? "Stored in the database."
                  : "Attach a receipt or photo."}
              </p>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file);
                  else if (!isExistingImage) onChange(null);
                }}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imageRef.current?.click()}
                >
                  Upload
                </Button>
                {value && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange("")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};