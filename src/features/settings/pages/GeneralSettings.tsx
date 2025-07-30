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
import { Check, ChevronsUpDown } from "lucide-react";
import { useSelector } from "react-redux";
const GeneralSettings = () => {
  const settings = useSelector((state: any) => state.settings);
  const timezones = moment.tz.names();
  console.log(settings);

  const form = useForm({
    resolver: yupResolver(generalSettings?.schema),
    defaultValues: generalSettings?.defaultValues,
  });

  const { control, reset, watch, setValue } = form;

  console.log(watch());
  useEffect(() => {
    reset({
      timezone: settings?.timezone,
      timeFormat: settings?.timeFormat === "hh:mm A" ? "12" : "24",
    });
  }, []);

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-lg">Date & Time</h1>
          <Separator />
        </div>{" "}
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2>Timezone</h2>
            <p className="text-sm hidden sm:inline text-gray-400">
              Choose your local timezone for accurate timestamps
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
                        {value
                          ? timezones.find((timezone) => timezone === value)
                          : "Select language"}
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
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((language, index) => (
                            <CommandItem
                              value={language}
                              key={index}
                              onSelect={() => {
                                onChange(language);
                              }}
                            >
                              {language}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  language === value
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
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2>Time Format</h2>
            <p className="text-sm hidden sm:inline text-gray-400">
              Choose how time is displayed (e.g., 3:45 PM or 15:45)
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
                      <TabsTrigger value="12">12</TabsTrigger>
                      <TabsTrigger value="24">24</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default GeneralSettings;
