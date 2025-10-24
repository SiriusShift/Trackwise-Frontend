import { FormField, FormItem } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import React from "react";

const NotificationSetting = ({ title, description, name, control }) => (
  <div className="flex flex-row justify-between items-center py-3 border-border last:border-0">
    <div className="space-y-1">
      <h1 className="font-medium">{title}</h1>
      <p className="text-sm text-muted-foreground hidden sm:block">
        {description}
      </p>
    </div>
    <FormField
      name={name}
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
);

export default NotificationSetting;
