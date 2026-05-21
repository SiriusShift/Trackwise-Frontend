import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import React from "react";

const ConfirmDialog = ({ open, setOpen, data }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={false}
        className="w-full flex flex-col max-w-full h-dvh sm:max-w-md sm:h-auto sm:max-h-[90%] sm:min-h-lg sm:w-md"
      >
        <div>
          <h1 className="font-semibold">Confirm scheduled transaction</h1>
          <p className="text-muted-foreground text-sm">
            These are due today. Edit if needed, then log them
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <h1 className="text-sm font-semibold">Description</h1>
          <p className="text-sm text-muted-foreground">{data?.description}</p>
        </div>{" "}
        <Separator />
        <div className="flex flex-row justify-between">
          <h1 className="text-sm font-semibold">Amount</h1>
          <p className="text-sm text-muted-foreground">{data?.amount}</p>
        </div>
                <Separator />
        <div className="flex flex-row justify-between">
          <h1 className="text-sm font-semibold">Account</h1>
          <p className="text-sm text-muted-foreground">{data?.amount}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
