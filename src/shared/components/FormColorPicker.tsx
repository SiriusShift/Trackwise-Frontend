import { Control, FieldPath, FieldValues } from "react-hook-form";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type FormColorPickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
};

const COLOR_OPTIONS = [
  "#3b82f6", // blue
  "#0ea5e9", // sky
  "#06b6d4", // cyan
  "#14b8a6", // teal
  "#22c55e", // green
  "#84cc16", // lime
  "#f59e0b", // amber
  "#f97316", // orange
  "#ef4444", // red
  "#f43f5e", // rose
  "#ec4899", // pink
  "#a855f7", // purple
  "#8b5cf6", // violet
  "#6366f1", // indigo
] as const;

export function FormColorPicker<T extends FieldValues>({
  control,
  name,
  label,
}: FormColorPickerProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
      const value = field.value ?? "";

const isCustomColor =
  value !== "" && !COLOR_OPTIONS.some((color) => color === value);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <div className="flex h-10 flex-wrap items-center gap-1.5">
                {COLOR_OPTIONS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    title={hex}
                    aria-label={`Select color ${hex}`}
                    aria-pressed={field.value === hex}
                    onClick={() => field.onChange(hex)}
                    className={cn(
                      "h-6 w-6 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                      field.value === hex
                        ? "ring-2 ring-primary"
                        : "ring-1 ring-border"
                    )}
                    style={{ backgroundColor: hex }}
                  />
                ))}

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title={isCustomColor ? field.value : "Custom color"}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
                        isCustomColor
                          ? "ring-2 ring-primary"
                          : "ring-1 ring-border"
                      )}
                      style={{
                        background: isCustomColor
                          ? field.value
                          : "conic-gradient(from 90deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)",
                      }}
                    >
                      {!isCustomColor && (
                        <Plus className="h-3 w-3 text-white drop-shadow" />
                      )}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto space-y-2 p-3">
                   <HexColorPicker
  color={field.value ?? COLOR_OPTIONS[0]}
  onChange={field.onChange}
/>

<HexColorInput
  color={field.value ?? COLOR_OPTIONS[0]}
  onChange={field.onChange}
  prefixed
  className="w-full rounded-md border bg-background px-2 py-1 text-sm font-mono uppercase"
/>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}