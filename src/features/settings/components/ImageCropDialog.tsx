import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { ImageIcon, Loader2 } from "lucide-react";

import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
import { getCroppedImageFile } from "@/shared/utils/cropImage";

interface ImageCropDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageSrc: string | null;
  fileName: string;
  onCropped: (file: File) => void;
}

const ImageCropDialog = ({
  open,
  setOpen,
  imageSrc,
  fileName,
  onCropped,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setOpen(false);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName,
      );
      onCropped(file);
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CommonDialog
      icon={ImageIcon}
      open={open}
      setOpen={(next) => {
        if (!next) handleClose();
        else setOpen(next);
      }}
      title="Crop profile picture"
      description="Drag to reposition and zoom to adjust the crop area."
      preventClickOutside
      contentClassName="sm:max-w-md"
    >
      <div className="px-6 py-5 ">
        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, areaPixels) =>
                setCroppedAreaPixels(areaPixels)
              }
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="sticky -mx-0 flex justify-end gap-2 border-t bg-background px-6 py-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </CommonDialog>
  );
};

export default ImageCropDialog;
