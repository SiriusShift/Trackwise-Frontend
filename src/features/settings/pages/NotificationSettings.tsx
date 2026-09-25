import { notificationSettings } from "@/schema/schema";
import { FormField, FormItem } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Input } from "@/shared/components/ui/input";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../api/settingsApi";

interface NotificationSettingsFormValues {
  notifyDays: number;
  emailNotification: boolean;
  mobileNotification: boolean;
}

const NotificationSettings = () => {
  const { data: settings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettings?.schema),
    defaultValues: notificationSettings?.defaultValues,
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
      notifyDays: settings.notifyDays,
      emailNotification: settings.emailNotification,
      mobileNotification: settings.mobileNotification,
    });
  }, [settings, reset]);

  const onSubmit = async (values: NotificationSettingsFormValues) => {
    try {
      await updateSettings({
        notifyDays: Number(values.notifyDays),
        emailNotification: values.emailNotification,
        mobileNotification: values.mobileNotification,
      }).unwrap();

      reset(values);
      toast.success("Notification settings updated successfully.");
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Settings</h1>
          <Separator />
        </div>
        {/* Email Notification */}
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-base font-medium">Email</h1>
            <p className="text-sm text-muted-foreground hidden sm:inline">
              Receive updates, reminders, and reports directly in your email.
            </p>
          </div>
          <FormField
            name="emailNotification"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormItem>
            )}
          />
        </div>

        {/* Mobile Notification */}
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-base font-medium">Mobile</h1>
            <p className="text-sm text-muted-foreground hidden sm:inline">
              Enable to receive instant alerts and reminders via your mobile
              device.
            </p>
          </div>
          <FormField
            name="mobileNotification"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="space-y-2">
          <h1 className="text-lg font-semibold">Transactions</h1>
          <Separator />
        </div> */}

        {/* Expense / Income / Loan Notifications */}
        {/* Scheduled Transaction Notifications */}
        <div className="flex flex-row justify-between items-center border-border last:border-0">
          <div className="space-y-1">
            <h1 className="font-medium">Scheduled transactions</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Set how many days in advance you'd like to receive a reminder
              before a scheduled transaction occurs.
            </p>
          </div>

          <FormField
            name="notifyDays"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  className="w-36 text-start"
                  placeholder="Days"
                />
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

export default NotificationSettings;
