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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import "@/shared/styles/Popover.css";

const ExpenseForm = ({ assetData, categoryData, setOpenFrequency, type }) => {
  const { watch, control, setValue } = useFormContext();
  console.log(assetData);
  const imageRef = useRef();
  return (
    <div className="flex gap-4 flex-col">
      <div className="space-y-4">
        <FormField
          name="source"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{type === "Income" ? "To" : "From"} </FormLabel>
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
                              assetData.find((asset) => asset.id === value?.id)
                                ?.name
                            }
                          </span>
                          <span>
                            ₱{
                              assetData.find((asset) => asset.id === value?.id)
                                ?.balance
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
                <PopoverContent className="p-0">
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
                            {asset.name}
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
        <div className="grid grid-cols-2 gap-5">
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
                            "w-[200px] justify-between",
                            !value && "text-muted-foreground"
                          )}
                        >
                          {value
                            ? categoryData.find(
                                (category) => category.id === value?.id
                              )?.name
                            : "Select category"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search category..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categoryData.map((category) => (
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
                      disabled={!watch("source")}
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

      <div className="flex gap-1">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date & Time</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        `${moment(field.value).format("MMM DD, YYYY hh:mm A")}` // Format date & time
                      ) : (
                        <span>Pick a date & time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="flex flex-col space-y-4">
                    {/* Calendar for Date Selection */}
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        const newDate = new Date(
                          date.setHours(
                            field.value ? new Date(field.value).getHours() : 0,
                            field.value ? new Date(field.value).getMinutes() : 0
                          )
                        );
                        console.log("Selected Date:", newDate);
                        field.onChange(newDate); // Update date with time preserved
                      }}
                      initialFocus
                      disabled={(date) => {
                        const minDate = new Date("2000-01-01"); // Minimum date
                        return date < minDate;
                      }}
                    />
                    {/* Time Picker for Time Selection */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Time:</label>
                      <input
                        type="time"
                        className="border text-black rounded-md px-2 py-1 text-sm"
                        value={
                          field.value ? moment(field.value).format("HH:mm") : ""
                        }
                        onSelect={(date) => {
                          const newDate = new Date(
                            date.setHours(
                              field.value
                                ? new Date(field.value).getHours()
                                : 0,
                              field.value
                                ? new Date(field.value).getMinutes()
                                : 0
                            )
                          );
                          console.log("Selected Date:", newDate);
                          field.onChange(newDate); // Update date with time preserved
                        }}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number);
                          const updatedDate = field.value
                            ? new Date(field.value)
                            : new Date(); // Use the selected date or default to now
                          updatedDate.setHours(hours, minutes);
                          console.log("Updated Time:", updatedDate);
                          field.onChange(updatedDate); // Update time with the correct date preserved
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* <FormMessage>{errors.date?.message}</FormMessage> */}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mode"
          render={({ field }) => (
            <FormItem className="flex items-end">
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-normal gap-2">
                      <Repeat />
                      {field.value && field.value !== "none" && (
                        <span className="hidden sm:inline capitalize">
                          {field.value}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("repeat", null);
                        setValue("months", null);
                      }}
                    >
                      <DropdownMenuRadioItem value="none">
                        None
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="recurring">
                        Recurring
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="installment">
                        Installment
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {watch("mode") === "recurring" && (
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>End Date</FormLabel>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          `${moment(field.value).format(
                            "MMM DD, YYYY hh:mm A"
                          )}` // Format date & time
                        ) : (
                          <span>Pick a date & time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="flex flex-col space-y-4">
                      {/* Calendar for Date Selection */}
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          const newDate = new Date(
                            date.setHours(
                              field.value
                                ? new Date(field.value).getHours()
                                : 0,
                              field.value
                                ? new Date(field.value).getMinutes()
                                : 0
                            )
                          );
                          console.log("Selected Date:", newDate);
                          field.onChange(newDate); // Update date with time preserved
                        }}
                        initialFocus
                        disabled={(date) => {
                          const minDate = new Date("2000-01-01"); // Minimum date
                          return date < minDate;
                        }}
                      />
                      {/* Time Picker for Time Selection */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Time:</label>
                        <input
                          type="time"
                          className="border text-black rounded-md px-2 py-1 text-sm"
                          value={
                            field.value
                              ? moment(field.value).format("HH:mm")
                              : ""
                          }
                          onSelect={(date) => {
                            const newDate = new Date(
                              date.setHours(
                                field.value
                                  ? new Date(field.value).getHours()
                                  : 0,
                                field.value
                                  ? new Date(field.value).getMinutes()
                                  : 0
                              )
                            );
                            console.log("Selected Date:", newDate);
                            field.onChange(newDate); // Update date with time preserved
                          }}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const updatedDate = field.value
                              ? new Date(field.value)
                              : new Date(); // Use the selected date or default to now
                            updatedDate.setHours(hours, minutes);
                            console.log("Updated Time:", updatedDate);
                            field.onChange(updatedDate); // Update time with the correct date preserved
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* <FormMessage>{errors.date?.message}</FormMessage> */}
              </FormItem>
            )}
          />
        </div>
      )}
      {watch("mode") === "installment" && (
        <FormField
          name="months"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Installment Term</FormLabel>
              <FormControl>
                <Input min={0} {...field} type="number" />
              </FormControl>
            </FormItem>
          )}
        />
      )}
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
                  <div className="relative border rounded p-3 bg-muted">
                    <div className="flex items-start gap-3">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Attachment preview"
                          className="w-[85px] h-[85px] object-cover rounded"
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
                        <div className="flex items-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => imageRef.current?.click()}
                            className="flex items-center gap-2"
                          >
                            Upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              onChange("");
                              setPreviewImage(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File input */}
                  {/* <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            onChange(reader.result);
                          };
                          reader.readAsDataURL(file);
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
                    {value && (
                      <p className="text-xs text-gray-500 mt-1">
                        Choose a new file to replace the current image
                      </p>
                    )}
                  </div> */}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default ExpenseForm;
