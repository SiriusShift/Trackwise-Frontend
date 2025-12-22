import { generalSettings } from "@/schema/schema";
import { Separator } from "@/shared/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/shared/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";
import { time } from "console";
import { Check, ChevronsUpDown, Currency } from "lucide-react";
import { useSelector } from "react-redux";
import currency from "currency-codes";
import { IRootState } from "@/app/store";

const GeneralSettings = () => {
  const settings = useSelector((state: IRootState) => state.settings);
  const timezones = moment.tz.names();
  console.log(timezones)
  console.log(settings);

  const form = useForm({
    resolver: yupResolver(generalSettings?.schema),
    defaultValues: generalSettings?.defaultValues,
  });

  console.log(currency);
  const { control, reset, watch } = form;

  console.log(watch());
  useEffect(() => {
    reset({
      timezone: settings?.timezone,
      timeFormat: settings?.timeFormat === "hh:mm A" ? "12" : "24",
      currency: currency?.data?.find((item) => item?.code === settings?.currency)
    });
  }, []);

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        {/* Date & Time Header */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Date & Time</h1>
          <Separator />
        </div>

        {/* Timezone */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-medium">Timezone</h2>
            <p className="text-sm text-muted-foreground hidden sm:inline">
              Set your timezone to display dates and times accurately.
            </p>
          </div>
          <FormField
            name="timezone"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormItem className="flex flex-col">
                <Popover>
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
                        {value || "Select timezone"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search timezone..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((timezone, index) => (
                            <CommandItem
                              value={timezone}
                              key={index}
                              onSelect={() => onChange(timezone)}
                            >
                              {timezone}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  timezone === value
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
        </div>

        {/* Time Format */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-medium">Time Format</h2>
            <p className="text-sm text-muted-foreground hidden sm:inline">
              Choose between 12-hour (AM/PM) or 24-hour time display.
            </p>
          </div>
          <FormField
            name="timeFormat"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormControl>
                  <Tabs value={value} onValueChange={onChange}>
                    <TabsList>
                      <TabsTrigger value="12">12-hour</TabsTrigger>
                      <TabsTrigger value="24">24-hour</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Currency Header */}
        <div className="space-y-2 pt-4">
          <h1 className="text-lg font-semibold">Currency</h1>
          <Separator />
        </div>

        {/* Duplicate Time Format - Replace or remove */}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-medium">Currency Format</h2>
            <p className="text-sm text-muted-foreground hidden sm:inline">
              Choose your preferred currency display format.
            </p>
          </div>
          <FormField
            name="currency"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormControl>
                  <Popover>
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
                          {value?.currency || "Select currency"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search currency..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {currency?.data?.map((currency, index) => (
                              <CommandItem
                                value={currency}
                                key={index}
                                onSelect={() => onChange(currency)}
                              >
                                {`${currency?.currency} (${currency?.code})`}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    currency?.currency === value?.currency
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
                </FormControl>
              </FormItem>
            )}
          />
          {/* You might want to replace this duplicate timeFormat field with a real currency format option here */}
        </div>
      </div>
    </FormProvider>
  );
};

export default GeneralSettings;
