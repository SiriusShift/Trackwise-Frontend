import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { Check, ChevronsUpDown, Loader2, Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { trackerSchema } from "@/schema/schema";
import { trackerFormType } from "@/shared/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import {
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import { Input } from "../ui/input";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { IRootState } from "@/app/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput } from "../ui/command";
import { CommandGroup, CommandItem, CommandList } from "../ui/command";

function TrackerDialog({
  title,
  mode,
  onSubmit,
  isLoading,
  open,
  setOpen,
  description,
  data,
}: {
  title: string;
  mode: string;
  description: string;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  open: boolean;
  onSubmit: (data: any) => void;
  data?: Object;
}) {
  //STATE
  // const [open, setOpen] = useState(false);
  //HOOKS
  const width = useScreenWidth();
  const { confirm, isOpen } = useConfirm(1);
  const type = useSelector((state: IRootState) => state.active.type);
  // RTK Query
  const { data: categoryData } = useGetCategoryQuery({
    type: type,
  });

  console.log(categoryData);
  const filteredCategory =
    Array.isArray(data) && data?.length > 0
      ? categoryData?.filter((item) =>
          data?.some((category) => item?.id !== category?.category?.id)
        )
      : categoryData;
  console.log(filteredCategory);

  const form = useForm<trackerFormType>({
    resolver: yupResolver(trackerSchema.schema),
    mode: "onChange",
    defaultValues: trackerSchema.defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = form;

  const handleClose = () => {
    confirm({
      description:
        "Are you sure you want to close this dialog? All unsaved input will be lost.",
      title: "Close Dialog",
      variant: "destructive",
      confirmText: "Close",
      cancelText: "Cancel",
      onConfirm: () => {
        setOpen(false);
        reset();
      },
      onCancel: () => {
        console.log("Test")
      }
    });
  };

  useEffect(() => {
    if (Array.isArray(data)) return;
    if (open && data) {
      reset({
        category: data?.category,
        amount: data?.value,
        id: data?.id,
      });
    }
    return () => {
      if (!open) {
        reset(trackerSchema.defaultValues); // Reset when dialog closes
      }
    };
  }, [open, data, setValue, reset]);

  return (
    <>
      <FormProvider {...form}>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            if (!o && isDirty) {
              handleClose();
            } else {
              setOpen(o);
            }
          }}
        >
          <DialogContent
            onInteractOutside={(e) =>
              (isDirty || isLoading) && e.preventDefault()
            }
            className="sm:min-w-[550px]"
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col justify-between p-1 gap-2 overflow-auto"
            >
              <div className="flex flex-col gap-5">
                {/* Category Field */}
                <FormField
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Category <span className="text-destructive">*</span>
                        </FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !value && "text-muted-foreground"
                                )}
                              >
                                {value
                                  ? categoryData?.find(
                                      (category) => category.id === value?.id
                                    )?.name
                                  : "Select category"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent full className="w-[200px] h-52 p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search category..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {categoryData?.map((category) => (
                                    <CommandItem
                                      value={category}
                                      key={category.id}
                                      onSelect={() => {
                                        onChange(category);
                                      }}
                                      className="flex p-2"
                                    >
                                      {category.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          category.id === value?.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Amount Field */}
                <FormField
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Monthly limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₱
                          </span>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            onChange={(e) => numberInput(e, field)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-0">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => (isDirty ? handleClose() : setOpen(false))}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || isLoading}
                >
                  {/* {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : ( */}
                    {mode === "edit" ? "Update" : "Set"} budget
                  {/* )} */}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </FormProvider>
    </>
  );
}

export default TrackerDialog;
