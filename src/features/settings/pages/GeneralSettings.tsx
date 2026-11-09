import { generalSettings } from "@/schema/schema";
import { Separator } from "@/shared/components/ui/separator";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Combobox } from "@/shared/components/Combobox";
import { Button } from "@/shared/components/ui/button";
import moment from "moment-timezone";
import { useDispatch } from "react-redux";
import currency from "currency-codes";
import { toast } from "sonner";
import { GeneralSettingsFormValues } from "@/schema/schema";
import { setSettings } from "@/shared/slices/settingsSlice";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../api/settingsApi";

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const timezones = moment.tz.names();

  const { data: settings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettings?.schema),
    defaultValues: generalSettings?.defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    if (!settings) return;

    reset({
      timezone: settings.timezone,
      timeFormat: settings.timeFormat === "hh:mm A" ? "12" : "24",
      currency: currency?.data?.find((item) => item?.code === settings.currency),
    });
  }, [settings, reset]);

  const onSubmit = async (values: GeneralSettingsFormValues) => {
    try {
      const updated = await updateSettings({
        timezone: values.timezone,
        timeFormat: values.timeFormat === "12" ? "hh:mm A" : "HH:mm",
        currency: values.currency?.code,
      }).unwrap();

      dispatch(
        setSettings({
          timezone: updated.timezone,
          timeFormat: updated.timeFormat,
          currency: updated.currency,
        }),
      );
      reset(values);
      toast.success("Settings updated successfully.");
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Date & Time Header */}
        <div className="space-y-2">
          <span className="block text-lg font-semibold">Date & Time</span>
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
                <FormControl>
                  <Combobox
                    className="w-[200px]"
                    contentClassName="w-[200px]"
                    items={timezones}
                    value={value}
                    onChange={onChange}
                    getKey={(timezone) => timezone}
                    getLabel={(timezone) => timezone}
                    placeholder="Select timezone"
                    searchPlaceholder="Search timezone..."
                  />
                </FormControl>
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
          <span className="block text-lg font-semibold">Currency</span>
          <Separator />
        </div>

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
                  <Combobox
                    className="w-[200px]"
                    contentClassName="w-[200px]"
                    items={currency?.data}
                    value={value}
                    onChange={onChange}
                    getKey={(currency) => currency.currency}
                    getLabel={(currency) => currency.currency}
                    getSearchValue={(currency) =>
                      `${currency.currency} ${currency.code}`
                    }
                    renderItem={(currency) =>
                      `${currency.currency} (${currency.code})`
                    }
                    placeholder="Select currency"
                    searchPlaceholder="Search currency..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default GeneralSettings;
