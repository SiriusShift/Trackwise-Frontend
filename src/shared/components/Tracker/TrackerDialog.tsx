import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import { trackerSchema } from "@/schema/schema";
import {
  useGetCategoryQuery,
  usePatchCategoryLimitMutation,
  usePostCategoryLimitMutation,
} from "@/shared/api/categoryApi";
import { budgetFrequency } from "@/shared/constants/dateConstants";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { trackerFormType } from "@/shared/types";
import { numberInput } from "@/shared/utils/CustomFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Icons from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function TrackerDialog({
  title,
  mode,
  open,
  setOpen,
  description,
  data,
}: {
  title: string;
  mode: string;
  description: string;
  setOpen: (open: boolean) => void;
  open: boolean;
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
  const [triggerPost, { isLoading: createLoading }] =
    usePostCategoryLimitMutation();
  const [triggerUpdate, { isLoading: updateLoading }] =
    usePatchCategoryLimitMutation();

  const isLoading = createLoading || updateLoading;
  const filteredCategory =
    Array.isArray(data) && data?.length > 0
      ? categoryData?.filter((item) =>
          data?.some((category) => item?.id !== category?.category?.id),
        )
      : categoryData;

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

  function handleCloseIntent() {
    if (!isDirty) {
      setOpen(false);
      return;
    }
    confirm({
      title: "Discard changes?",
      description: "All unsaved changes will be lost.",
      variant: "destructive",
      confirmText: "Discard",
      cancelText: "Keep editing",
      onConfirm: () => {
        setOpen(false);
        reset();
      },
    });
  }

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      if (data?.id) {
        await confirm({
          title: "Confirm Update",
          description: "Update this budget limit with your new amount?",
          variant: "info",
          showLoadingOnConfirm: true,
          onConfirm: async () => {
            await triggerUpdate({
              id: data?.id,
              amount: { amount: data?.amount },
            }).unwrap();
            setOpen(false);
            return;
          },
        });
      } else {
        await confirm({
          title: "Create Budget Limit",
          description:
            "Would you like to create a new budget limit for this category?",
          variant: "info",
          showLoadingOnConfirm: true,
          onConfirm: async () => {
            await triggerPost({
              categoryId: data?.category?.id,
              amount: data?.amount,
              period: data?.period,
            }).unwrap();
            setOpen(false);
            return;
          },
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
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
              handleCloseIntent();
            } else {
              setOpen(o);
            }
          }}
        >
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="flex flex-col w-full max-w-full h-dvh p-0 sm:max-w-lg sm:h-auto sm:max-h-[90vh] gap-0"
          >
            <DialogHeader className="flex flex-row items-center gap-3 px-6 py-4 border-b">
              <Icons.Target className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="mt-0.5">
                  {description}
                </DialogDescription>
              </div>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col justify-between  gap-2 overflow-auto "
            >
              <div className="flex flex-col gap-5 px-6 py-4">
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
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !value && "text-muted-foreground",
                                )}
                              >
                                {value
                                  ? categoryData?.find(
                                      (category) => category.id === value?.id,
                                    )?.name
                                  : "Select category"}
                                <Icons.ChevronsUpDown className="opacity-50" />
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
                                  {categoryData?.map((category) => {
                                    const LucidIcon = Icons[category?.icon];

                                    return (
                                      <CommandItem
                                        value={category}
                                        key={category.id}
                                        onSelect={() => {
                                          onChange(category);
                                        }}
                                        className="flex p-2 justify-between"
                                        disabled={category?.hasTracker}
                                      >
                                        <div className="flex flex-row items-center gap-3">
                                          <Card
                                            className={`p-2 rounded-lg border`}
                                            style={{
                                              backgroundColor: `${category?.color}33`,
                                              color: category?.color,
                                            }}
                                          >
                                            <LucidIcon />
                                          </Card>
                                          <p> {category.name}</p>
                                        </div>
                                        <div className="flex flex-row items-center">
                                          {category?.hasTracker && (
                                            <Badge
                                              variant={"outline"}
                                              className="bg-red-200 text-red-500"
                                            >
                                              Existing
                                            </Badge>
                                          )}
                                          <Icons.Check
                                            className={cn(
                                              "ml-auto",
                                              category.id === value?.id
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground">
                          Each category can only have one active budget at a
                          time.
                        </p>
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
                      <FormLabel>Limit amount</FormLabel>
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
                />{" "}
                <FormField
                  control={control}
                  name="period"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <FormLabel>
                          Period <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {budgetFrequency.map(
                              ({ value: opt, name, icon: Icon }) => {
                                const selected = value === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => onChange(opt)}
                                    className={cn(
                                      "flex flex-col items-center rounded-xl border p-3 text-left transition-all duration-200",
                                      selected
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/40",
                                    )}
                                  >
                                    <Icon size={18} />
                                    <p className="text-sm">{name}</p>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 px-6 py-4 border-t">
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() =>
                      isDirty ? handleCloseIntent() : setOpen(false)
                    }
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
                  {mode === "edit" ? "Update" : "Submit"}
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
