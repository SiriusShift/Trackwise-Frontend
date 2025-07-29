import { generalSettings } from "@/schema/schema";
import { Button } from "@/shared/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Separator } from "@/shared/components/ui/separator";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/shared/components/ui/select";
import { daysOfWeek } from "@/shared/constants/dateConstants";

import { AppWindowIcon, CodeIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const GeneralSettings = () => {
  const { watch, control } = useForm({
    resolver: yupResolver(generalSettings?.schema),
    defaultValues: yupResolver(generalSettings?.defaultValues),
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-xl">Date & Time</h1>
        <Separator />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2>Timezone</h2>
          <p className="text-sm text-gray-400">
            Choose your local timezone for accurate timestamps
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2>Time Format</h2>
          <p className="text-sm text-gray-400">
            Choose how time is displayed (e.g., 3:45 PM or 15:45)
          </p>
        </div>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="12">12</TabsTrigger>
            <TabsTrigger value="24">24</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default GeneralSettings;
