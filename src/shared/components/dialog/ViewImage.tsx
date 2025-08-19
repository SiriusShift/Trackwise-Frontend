import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";

const ViewImage = ({
  image,
  open,
  setOpen,
}: {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  console.log(image)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
      <img src={image} />
      </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
