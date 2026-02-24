import React from "react";
import { Dialog, DialogContent } from "../../ui/dialog";
import NoData from "@/assets/images/file.png";

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
      <DialogContent className="min-h-[500px] flex flex-col  justify-center items-center">
        {image ? (
          <img src={image} className="object-cover" />
        ) : (
          <>
            {" "}
            <img src={NoData} className="w-52" />
            <p>No image found in this transaction</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
