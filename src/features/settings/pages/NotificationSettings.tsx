import { notificationSettings } from "@/schema/schema";
import { FormField, FormItem } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import NotificationSetting from "./components/NotificationSetting";
import { Separator } from "@/shared/components/ui/separator";
import { Input } from "@/shared/components/ui/input";

const NotificationSettings = () => {
  const form = useForm({
    resolver: yupResolver(notificationSettings?.schema),
    defaultValues: notificationSettings?.defaultValues,
  });

  const { control } = form;

  return (
    <FormProvider {...form}>
      <section className="space-y-6">
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
        <div className="flex flex-row justify-between items-center border-border last:border-0">
          <div className="space-y-1">
            <h1 className="font-medium">Notifications</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Set how many days in advance you’d like to be notified before an
              expense is due.
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
                  min="0"
                  className="w-36 text-start"
                  placeholder="Days"
                />
              </FormItem>
            )}
          />
        </div>
      </section>
    </FormProvider>
  );
};

export default NotificationSettings;
