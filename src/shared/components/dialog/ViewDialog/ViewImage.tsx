import React from "react";
import { Dialog, DialogContent } from "../../ui/dialog";
import NoData from "@/assets/images/file.png";
import { Button } from "../../ui/button";
import { X } from "lucide-react";

const ViewImage = ({
  image,
  open,
  setOpen,
}: {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  console.log(image);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl p-2 border-none bg-transparent shadow-none" removeClose>
    <div className="relative">
      <img
        src={image}
        alt="Preview"
        className="max-h-[85vh] w-full rounded-xl object-contain"
      />

      <Button
        size="icon"
        variant="secondary"
        className="absolute right-2 top-2"
        onClick={() => setOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
