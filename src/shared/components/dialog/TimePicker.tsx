import { Dialog, DialogContent } from "../ui/dialog";
import React from "react";

const TimePicker = ({ open, setOpen, setDateOpen }) => {
  return (
    <Dialog
      modal={true}
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false);
        }
      }}
    >
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default TimePicker;
