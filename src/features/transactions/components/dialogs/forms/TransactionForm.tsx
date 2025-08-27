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
import { numberInput } from "@/shared/utils/CustomFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/shared/components/ui/dropdown-menu";
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
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Toggle } from "@/shared/components/ui/toggle";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import DatePicker from "@/shared/components/dialog/DatePicker";

const TransactionForm = ({
  assetData,
  categoryData,
  setOpenFrequency,
  type,
}) => {
  const [open, setOpen] = useState(false);
  const width = useScreenWidth();
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  console.log(type);
  console.log("Has errors", errors);
  const imageRef = useRef();
  return (
    <div className="flex gap-4 flex-col">
      <div className="space-y-4">
        {!watch("recurring") && (
          <>
            {(type === "Expense" || type === "Transfer") && (
              <FormField
                name="from"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From</FormLabel>
                    <Popover>
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
                                  {
                                    assetData.find(
                                      (asset) => asset.id === value?.id
                                    )?.balance
                                  }
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
                                  {asset.name} - ₱{asset?.balance}
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
                    <Popover>
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
                                  {
                                    assetData.find(
                                      (asset) => asset.id === value?.id
                                    )?.balance
                                  }
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
                                  {asset.name} - ₱{asset?.balance}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "sm:w-[200px] justify-between",
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
                    <PopoverContent full className="w-[200px] p-0">
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
                <FormLabel>Amount</FormLabel>
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
                            ? !watch("from")
                            : type === "Income"
                            ? !watch("to")
                            : !watch("from") && !watch("to")
                          : false
                      }
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const balance = watch("source")?.remainingBalance;
                        console.log(balance);

                        if (balance && type !== "Income" && value > balance) {
                          toast.error("Insufficient balance");
                          e.target.value = balance; // Reset to the maximum allowed value
                        } else {
                          numberInput(e, field); // Proceed with normal input handling
                        }
                      }}
                    />
                  </div>
                </FormControl>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter description"
                  className="input-class text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-row gap-1">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date & Time</FormLabel>
              <Button
                variant={"outline"}
                type="button"
                className={cn(
                  "text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
                onClick={() => setOpen(true)}
              >
                {field.value ? (
                  `${moment(field.value).format("MMM DD, YYYY hh:mm A")}` // Format date & time
                ) : (
                  <span>Pick a date & time</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <DatePicker open={open} setOpen={setOpen} field={field} />
              {/* <FormMessage>{errors.date?.message}</FormMessage> */}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="recurring"
          render={({ field: { onChange, value } }) => (
            <FormItem className="flex items-end">
              <FormControl>
                <Toggle
                  value={value}
                  onPressedChange={(pressed) => onChange(pressed)}
                >
                  <Repeat />
                </Toggle>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {watch("recurring") && (
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <FormLabel>Repeat</FormLabel>
            <Button
              className="mt-2 justify-between"
              variant="outline"
              onClick={() => setOpenFrequency(true)}
              type="button"
            >
              {watch("repeat")?.name === "Custom"
                ? watch("repeat")?.interval === 1
                  ? `Every ${watch("repeat")?.interval} ${
                      watch("repeat")?.unit
                    }`
                  : `Every ${watch("repeat")?.interval} ${
                      watch("repeat")?.unit
                    }s`
                : watch("repeat") !== null
                ? watch("repeat")?.name
                : "Repeat every.."}
              <ArrowRight />
            </Button>
          </div>

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
                  onClick={() => setOpen(true)}
                >
                  {field.value ? (
                    `${moment(field.value).format("MMM DD, YYYY")}` // Format date & time
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
                <DatePicker
                  open={open}
                  setOpen={setOpen}
                  field={field}
                  removeTime={true}
                />
                {/* <FormMessage>{errors.date?.message}</FormMessage> */}
              </FormItem>
            )}
          />
        </div>
      )}
      {!watch("recurring") && (
      <FormField
        name="image"
        control={control}
        render={({ field: { onChange, value } }) => {
          // Determine if this is an existing image (URL) or new upload (data URL)
          const [previewUrl, setPreviewUrl] = useState<string | null>(null);

          const isExistingImage =
            value && typeof value === "string" && !value.startsWith("data:");

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
                          {isExistingImage ? "Current Image" : "Upload Image"}
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
