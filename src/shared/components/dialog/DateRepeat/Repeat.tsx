import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/components/ui/select";
import { frequencies } from "@/shared/constants/dateConstants";
import { Button } from "../../ui/button";
import { Check } from "lucide-react";
import { frequencyProps } from "@/shared/types/index";
import CustomFrequency from "./CustomFrequency";

const Repeat = ({
  open,
  setOpen,
  setParentDialogOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setParentDialogOpen: (open: boolean) => void;
}) => {
  const [active, setActive] = useState(null);
  const [openCustom, setOpenCustom] = useState(false);
  const { watch, control, setValue } = useFormContext();

  const handleClick = (frequency) => {
    if (frequency?.name !== "Custom") {
      setValue("repeat", frequency);
    } else {
      setOpenCustom(true);
      setOpen(false);
    }
    setActive(frequency);
  };

  console.log(active);

  return (
    <>
      {" "}
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

          {frequencies?.map((frequency: frequencyProps) => (
            <Button
              value={active}
              className="flex justify-between"
              variant={
                active?.name === frequency?.name ? "secondary" : "outline"
              }
              onClick={() => handleClick(frequency)}
            >
              {frequency?.name}
              {active?.name === frequency?.name && <Check />}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
      <CustomFrequency
        open={openCustom}
        setOpen={setOpenCustom}
        setParentDialogOpen={setOpen}
      />
    </>
  );
};

export default Repeat;
