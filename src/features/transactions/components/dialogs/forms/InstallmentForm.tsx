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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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

const InstallmentForm = ({ categoryData, type }) => {
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  console.log(watch());
  console.log("Has errors", errors);
  const imageRef = useRef();
  return (
    <div className="flex gap-4 flex-col">
      <div className="space-y-4">
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

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Start Date</FormLabel>
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
                      `${moment(field.value).format("MMM DD, YYYY")}` // Format date & time
                    ) : (
                      <span>Pick a date</span>
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
                  {/* <div className="flex items-center justify-between">
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
                            field.value ? new Date(field.value).getHours() : 0,
                            field.value ? new Date(field.value).getMinutes() : 0
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
                  </div> */}
                </div>
              </PopoverContent>
            </Popover>
            {/* <FormMessage>{errors.date?.message}</FormMessage> */}
          </FormItem>
        )}
      />

      <FormField
        name="months"
        control={control}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Installment Duration</FormLabel>
            <FormControl>
              <Input
                min={0}
                {...field}
                placeholder="Enter number of months"
                type="number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InstallmentForm;
