import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { formatCurrency, numberInput } from "@/shared/utils/CustomFunctions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  CreditCard,
  Repeat,
  Upload,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import { cn } from "@/lib/utils";
import { Calendar } from "@/shared/components/ui/calendar";
import { Input } from "../../../../../shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import moment from "moment";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Toggle } from "@/shared/components/ui/toggle";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import DatePicker from "@/shared/components/dialog/DatePicker";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";
import useFormatCurrency from "@/shared/hooks/useFormatCurrency";
import { Field } from "@/shared/types";
import { Textarea } from "@/shared/components/ui/textarea";

const TransactionForm = ({
  assetData,
  categoryData,
  setOpenFrequency,
  type,
  mode,
  history,
  setRecurring,
}) => {
  console.log(history);
  console.log(mode);
  const [open, setOpen] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const width = useScreenWidth();
  const formatCurrency = useFormatCurrency();
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  console.log(watch());
  console.log("Has errors", errors);

  const onDateChange = (field, date) => {
    field.onChange(date);
    if (watch("date") > moment()) {
      setValue("image", null);
      setValue("date", moment(watch("date")).startOf("day").toDate());
    } else if (watch("date") <= moment()) {
      setValue("date", moment());
    }
  };

  const imageRef = useRef();
  return (
    <div className="flex gap-4 flex-col">
      <div className="space-y-4">
        <div className="flex flex-row gap-4">
          <FormField
            control={control}
            name="date"
            render={({ field }: { field: Field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>
                  {watch("recurring") ? "Due date" : "Date & Time"}{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Button
                  variant={"outline"}
                  type="button"
                  disabled={watch("mode") === "transact"}
                  className={cn(
                    "text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(true)}
                >
                  {field.value ? (
                    watch("recurring") || watch("date") > moment() ? (
                      `${moment(field.value).format("MMM DD, YYYY")}` // Format date & time
                    ) : (
                      `${moment(field.value).format("MMM DD, YYYY hh:mm A")}` // Format date & time
                    )
                  ) : (
                    <span>Pick a date & time</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
                <DatePicker
                  setDate={onDateChange}
                  disablePast={watch("recurring")}
                  removeTime={watch("recurring") || watch("date") > moment()}
                  open={open}
                  setOpen={setOpen}
                  field={field}
                />
                {/* <FormMessage>{errors.date?.message}</FormMessage> */}
              </FormItem>
            )}
          />
          {mode !== "transact" && !history && (
            <FormField
              control={control}
              name="recurring"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex items-end">
                  <FormControl>
                    <Toggle
                      pressed={value}
                      onPressedChange={(pressed) => {
                        setValue("repeat", null);
                        setValue("auto", false);
                        setValue("endDate", null);
                        setValue("from", null);
                        if (type !== "Expense") {
                          setValue("to", null);
                        }
                        if (pressed) {
                          // setValue("mode", "fixed");
                          setValue("date", moment().startOf("day"));
                        } else {
                          // setValue("mode", null);
                          setValue("date", moment());
                        }
                        setValue("image", null);
                        onChange(pressed);
                        setRecurring((prev) => !prev);
                      }}
                    >
                      <Repeat />
                    </Toggle>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        {watch("recurring") && (
          <>
            <FormField
              control={control}
              name="auto"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex items-end">
                  <FormControl className="flex items-center space-x-4">
                    <div>
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => {
                          setValue("from", null);
                          // if (!checked) {
                          //   setValue("mode", "fixed");
                          // }
                          onChange(checked);
                        }}
                      />
                      <div>
                        {" "}
                        <p className="text-sm">Enable automatic processing</p>
                        <p className="text-xs text-muted-foreground">
                          This {type.toLowerCase()} will be automatically
                          {type === "Expense"
                            ? " paid "
                            : type === "Income"
                            ? " received "
                            : " transferred "}
                          when it's due.
                        </p>
                      </div>
                    </div>

                    {/* <Toggle
                  checked={value?.includes()}
                  onPressedChange={(pressed) => onChange(pressed)}
                >
                  <CreditCard />
                </Toggle> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {(!watch("recurring") || watch("auto")) &&
          (watch("date") <= moment() || mode) && (
            <>
              {(type === "Expense" || type === "Transfer") && (
                <FormField
                  name="from"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        From <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !value && "text-muted-foreground"
                              )}
                            >
                              {value ? (
                                <div className="space-x-2">
                                  <span>
                                    {
                                      assetData.find(
                                        (asset) => asset.id === value?.id
                                      )?.name
                                    }
                                  </span>
                                  <span>
                                    ₱
                                    {assetData
                                      .find((asset) => asset.id === value?.id)
                                      ?.remainingBalance.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                "Select asset..."
                              )}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent full className="p-0">
                          <Command>
                            <CommandInput placeholder="Search asset" />
                            <CommandList>
                              {" "}
                              <CommandEmpty>No assets found</CommandEmpty>
                              <CommandGroup>
                                {assetData?.map((asset) => (
                                  <CommandItem
                                    value={asset}
                                    key={asset.id}
                                    onSelect={() => {
                                      onChange(asset);
                                    }}
                                  >
                                    {asset.name} - ₱
                                    {asset?.remainingBalance.toFixed(2)}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        asset.id === value?.id
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
                  )}
                />
              )}

              {(type === "Income" || type === "Transfer") && (
                <FormField
                  name="to"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>To</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !value && "text-muted-foreground"
                              )}
                            >
                              {value ? (
                                <div className="space-x-2">
                                  <span>
                                    {
                                      assetData.find(
                                        (asset) => asset.id === value?.id
                                      )?.name
                                    }
                                  </span>
                                  <span>
                                    ₱
                                    {assetData
                                      .find((asset) => asset.id === value?.id)
                                      ?.remainingBalance.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                "Select asset..."
                              )}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent full className="p-0">
                          <Command>
                            <CommandInput placeholder="Search asset" />
                            <CommandList>
                              {" "}
                              <CommandEmpty>No assets found</CommandEmpty>
                              <CommandGroup>
                                {assetData?.map((asset) => (
                                  <CommandItem
                                    value={asset}
                                    key={asset.id}
                                    onSelect={() => {
                                      onChange(asset);
                                    }}
                                  >
                                    {asset.name} - ₱
                                    {asset?.remainingBalance.toFixed(2)}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        asset.id === value?.id
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
                  )}
                />
              )}
            </>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          disabled={history}
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

          <FormField
            name="amount"
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Amount <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₱
                    </span>
                    <Input
                      {...field}
                      min={0}
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      className="input-class text-sm pl-7"
                      disabled={
                        !watch("recurring")
                          ? type === "Expense"
                            ? !watch("from") && watch("date") <= moment()
                            : type === "Income"
                            ? !watch("to") && watch("date") <= moment()
                            : !watch("from") &&
                              !watch("to") &&
                              watch("date") <= moment()
                          : false
                      }
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const balance =
                          type === "Income"
                            ? watch("to")?.remainingBalance
                            : watch("from")?.remainingBalance;
                        const remainingBalance =
                          Number(watch("balance") || 0) +
                          Number(watch("initialAmount") || 0);

                        console.log(watch());
                        console.log(remainingBalance);
                        console.log(mode);

                        if (
                          balance &&
                          type !== "Income" &&
                          !watch("recurring") &&
                          value > balance
                        ) {
                          toast.error("Insufficient balance");
                          e.target.value = balance; // Reset to the maximum allowed value
                        } else if (
                          value > remainingBalance &&
                          (mode === "transact" || history)
                        ) {
                          toast.error(
                            `Amount exceeds the total balance of ${remainingBalance}`
                          );
                          e.target.value = balance; // Reset to the maximum allowed value
                        } else {
                          numberInput(e, field); // Proceed with normal input handling
                        }
                      }}
                    />
                  </div>
                </FormControl>
                {(mode === "transact" || history) && (
                  <p className="text-xs text-muted-foreground">
                    Balance: ₱{watch("balance")?.toFixed(2)}
                  </p>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Description <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description"
                  className="input-class text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {watch("recurring") && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <Controller
              name="repeat"
              control={control}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>
                    Repeat <span className="text-destructive">*</span>
                  </FormLabel>

                  <Button
                    className="mt-2 justify-between"
                    variant="outline"
                    type="button"
                    onClick={() => setOpenFrequency(true)}
                  >
                    {field.value?.name === "Custom"
                      ? field.value?.interval === 1
                        ? `Every ${field.value?.interval} ${field.value?.unit}`
                        : `Every ${field.value?.interval} ${field.value?.unit}s`
                      : field.value
                      ? field.value?.name
                      : "Repeat every.."}
                    <ArrowRight />
                  </Button>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End Date</FormLabel>
                  <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                      "text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={!watch("repeat")}
                    onClick={() => setOpenEndDate(true)}
                  >
                    {field.value ? (
                      moment(field.value).format("MMM DD, YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                  <DatePicker
                    open={openEndDate}
                    setOpen={setOpenEndDate}
                    disablePast={true}
                    field={field}
                    removeTime={true}
                  />
                </FormItem>
              )}
            />
          </div>
          {/* {!watch("auto") && (
            <FormField
              control={control}
              name="mode"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex items-end col-span-2">
                  <FormControl className="flex sm:items-center space-y-5">
                    <div className="w-full">
                      <Tabs
                        onValueChange={(value) => onChange(value)}
                        value={value}
                        className="flex flex-col w-full sm:flex-row sm:space-x-4 sm:items-center"
                      >
                        <TabsList>
                          <TabsTrigger className="w-full" value="fixed">
                            Fixed
                          </TabsTrigger>
                          <TabsTrigger className="w-full" value="variable">
                            Variable
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent
                          className="sm:mt-0 text-sm text-center sm:text-start"
                          value="fixed"
                        >
                          Same amount every cycle. Amount cannot be changed.
                        </TabsContent>
                        <TabsContent
                          className="sm:mt-0 text-sm text-center sm:text-start"
                          value="variable"
                        >
                          Amount may vary each cycle. You can update it when
                          needed.
                        </TabsContent>
                      </Tabs>
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}
        </>
      )}

      {!watch("recurring") &&
        ((watch("date") < moment() && mode === "add") ||
          mode === "transact" ||
          mode === "edit") && (
          <FormField
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => {
              // Determine if this is an existing image (URL) or new upload (data URL)
              const [previewUrl, setPreviewUrl] = useState<string | null>(null);

              const isExistingImage =
                value &&
                typeof value === "string" &&
                !value.startsWith("data:");

              useEffect(() => {
                if (value instanceof File) {
                  const url = URL.createObjectURL(value);
                  setPreviewUrl(url);

                  // Cleanup to avoid memory leak
                  return () => URL.revokeObjectURL(url);
                } else if (typeof value === "string") {
                  setPreviewUrl(value); // use existing image url
                } else {
                  setPreviewUrl(null);
                }
              }, [value]);

              // const isNewUpload =
              //   value && typeof value === "string" && value.startsWith("data:");

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Preview section */}
                      <div className="relative border rounded p-3 bg-card">
                        <div className="flex items-start gap-3">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Attachment preview"
                              className="h-16 w-16 sm:w-[85px] sm:h-[85px] object-cover rounded"
                            />
                          ) : (
                            <div className="w-[85px] h-[85px] flex items-center p-5 justify-center border rounded text-center text-xs text-muted-foreground">
                              No image selected
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {isExistingImage
                                ? "Current Image"
                                : "Upload Image"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {isExistingImage
                                ? "This image is stored in the database."
                                : "Upload an image or attachment to store."}
                            </p>
                            <input
                              type="file"
                              ref={imageRef}
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                } else {
                                  // If no file selected and there was an existing image, keep it
                                  // If no existing image, set to null
                                  if (!isExistingImage) {
                                    onChange(null);
                                  }
                                }
                              }}
                              id="imageUploader"
                              className={value ? "mt-2" : ""}
                            />
                            <div className="flex items-end pt-2 gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => imageRef.current?.click()}
                                className="flex items-center gap-2"
                              >
                                Upload
                              </Button>
                              {watch("image") && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    onChange("");
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
    </div>
  );
};

export default TransactionForm;
