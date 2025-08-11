import React from "react";
import { Dialog } from "../ui/dialog";

const ViewImage = ({
  image,
  open,
  setOpen,
}: {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <img src={image} />
    </Dialog>
  );
};

export default ViewImage;
