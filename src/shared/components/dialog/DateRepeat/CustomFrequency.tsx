import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../ui/select";
import { frequencyList } from "@/shared/constants/dateConstants";
import { Input } from "../../ui/input";
import { useFormContext } from "react-hook-form";

const CustomFrequency = ({
  open,
  setOpen,
  setParentDialogOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setParentDialogOpen: (open: boolean) => void;
}) => {
  const { watch, control, setValue } = useFormContext();

  const [frequency, setFrequency] = useState(frequencyList[0]);
  const [every, setEvery] = useState(1);

  console.log(watch);

  useEffect(() => {
    if (watch("mode") === "recurring") {
      setValue("repeat", {
        id: 9,
        name: "Custom",
        interval: every,
        unit: frequency,
      });
    }
  }, [frequency, every, setValue]);

  useEffect(() => {
    if (open) {
      setValue("repeat", {
        id: 9,
        name: "Custom",
        interval: every,
        unit: frequency,
      });
    }
  }, [open, setValue]);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false);
          setParentDialogOpen(true);
        }
      }}
    >
      <DialogContent className="w-full flex flex-col max-w-full h-dvh sm:max-w-lg sm:h-auto sm:max-h-[90%] sm:min-h-lg sm:w-md">
        <DialogHeader>
          <DialogTitle>Repeat</DialogTitle>
          {/* <DialogDescription>
            Fill in the details to create a new expense
          </DialogDescription> */}
        </DialogHeader>
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value)}
        >
          <SelectTrigger className="flex justify-between">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {frequencyList.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={every}
          onChange={(e) => setEvery(parseInt(e.target.value))}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomFrequency;
