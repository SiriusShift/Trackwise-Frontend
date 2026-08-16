import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree } from "lucide-react";
import { icons } from "lucide-react";
import { useState } from "react";

import CommonDialog from "@/shared/components/dialog/CommonDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { FormColorPicker } from "@/shared/components/FormColorPicker";
import IconPicker from "@/shared/components/IconPicker";
import { categorySchema } from "../schema/settings.schema";
import { CategoryDialogProps } from "../types/settings.types";

const DEFAULT_ICON = "Shapes";

const CategoryDialog = ({
  open,
  setOpen,
  mode,
  category, // assumed addition: pass the category being edited, undefined for "Add"
}: CategoryDialogProps) => {
  const [openIconPicker, setOpenIconPicker] = useState(false);

  const form = useForm({
    resolver: zodResolver(categorySchema.schema),
    defaultValues: categorySchema.defaultValues,
  });

  const { control, formState } = form;
  const isEdit = mode === "Edit";

  // Sync form with the category being edited (or reset to defaults for
  // "Add") every time the dialog opens, so reopening never shows stale data.
  useEffect(() => {
    if (!open) return;
    form.reset(isEdit && category ? category : categorySchema.defaultValues);
  }, [open, isEdit, category, form]);

  const onSubmit = form.handleSubmit((data) => {
    // TODO: wire to createCategory / updateCategory RTK Query mutations
    console.log(data);
    setOpen(false);
  });

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title={`${mode} Category`}
      icon={FolderTree}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="p-5 space-y-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Food" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="icon"
            render={({ field }) => {
              const Icon =
                icons[field.value as keyof typeof icons] ??
                icons[DEFAULT_ICON];

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Icon</FormLabel>

                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenIconPicker(true)}
                      aria-label={
                        field.value
                          ? `Change icon, currently ${field.value}`
                          : "Choose icon"
                      }
                      className="justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {field.value || "Choose icon"}
                    </Button>
                  </FormControl>

                  <FormMessage />

                  <IconPicker
                    open={openIconPicker}
                    setOpen={setOpenIconPicker}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              );
            }}
          />

          <FormColorPicker control={control} name="color" label="Color" />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={formState.isSubmitting || !formState.isValid}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </CommonDialog>
  );
};

export default CategoryDialog;