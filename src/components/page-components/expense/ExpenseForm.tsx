import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { numberInput } from "@/utils/CustomFunctions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { frequencies } from "@/utils/Constants";
import { Input } from "../../ui/input";
import { Button } from "@/components/ui/button";
import moment from "moment";

const ExpenseForm = ({ assetData, control, categoryData, watch }) => {
  console.log(assetData);
  return (
    <div className="flex gap-4 flex-col">
      <div className="space-y-4">
        <FormField
          name="source"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    // Find the selected category object based on the value (category name)
                    const selectedSource = assetData?.find(
                      (source) => source.name === value
                    );
                    field.onChange(selectedSource); // Set the entire object in the form state
                  }}
                  value={field.value?.name}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent portal={false} className="max-h-[200px]">
                    {assetData?.map((source) => (
                      <SelectItem key={source.id} value={source.name}>
                        <div className="flex justify-between items-center">
                          <span>{source.name}</span>
                          <span className="text-sm ml-2 text-gray-500">
                            ₱{source?.remainingBalance}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-5">
          <FormField
            name="category"
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      // Find the selected category object based on the value (category name)
                      const selectedCategory = categoryData?.find(
                        (category) => category.name === value
                      );
                      field.onChange(selectedCategory); // Set the entire object in the form state
                    }}
                    value={field.value?.name} // Set the category name as the value for display
                  >
                    <SelectTrigger className="capitalize">
                      {/* Display the name of the selected category */}
                      <SelectValue placeholder="Select a category">
                        {field.value?.name || "Select a category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent portal={false} className="max-h-[200px]">
                      {categoryData?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

                        if (balance && value > balance) {
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
                        setValue("frequency", null);
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
        <FormField
          name="repeat"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const selectedCategory = frequencies?.find(
                      (frequency) => frequency.name === value
                    );
                    field.onChange(selectedCategory);
                  }}
                  value={field.value?.name}
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent portal={false} className="max-h-[200px]">
                    {frequencies?.map((frequency) => (
                      <SelectItem key={frequency.id} value={frequency.name}>
                        {frequency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        render={({ field: { onChange } }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Attachment</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onChange(reader.result); // this updates the form field
                      // setValue("fileName", file?.name)
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                id="imageUploader"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ExpenseForm;
