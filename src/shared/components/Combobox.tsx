import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
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

type Key = string | number;

export interface ComboboxProps<T>
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "onChange" | "children"
  > {
  items: readonly T[] | undefined;
  /** Items drive the type; value must match an item's shape. */
  value: NoInfer<T> | null | undefined;
  onChange: (item: T) => void;
  /** Unique identity of an item; used to mark the selected one. */
  getKey: (item: T) => Key;
  /** Plain-text label; used for the trigger and as the default item content. */
  getLabel: (item: T) => string;
  /** Text cmdk filters on. Defaults to the label. */
  getSearchValue?: (item: T) => string;
  /** Custom item content. The check mark is always appended after it. */
  renderItem?: (item: T, selected: boolean) => React.ReactNode;
  /** Custom trigger content for the selected item. */
  renderValue?: (item: T) => React.ReactNode;
  isItemDisabled?: (item: T) => boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Set when the combobox sits inside a Dialog so scrolling works. */
  modal?: boolean;
  contentClassName?: string;
  /** Match the popover width to the trigger. */
  contentFull?: boolean;
  itemClassName?: string;
}

/**
 * Searchable single-select. Closes after a pick.
 * Wrap it in `<FormControl>` inside forms; id/aria props and the ref are
 * forwarded to the trigger button.
 */
function ComboboxInner<T>(
  {
    items,
    value,
    onChange,
    getKey,
    getLabel,
    getSearchValue = getLabel,
    renderItem,
    renderValue,
    isItemDisabled,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    modal,
    className,
    contentClassName,
    contentFull,
    itemClassName,
    ...triggerProps
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const [open, setOpen] = React.useState(false);

  const selectedKey = value != null ? getKey(value) : undefined;
  // Prefer the fresh item from the list; fall back to the stored value.
  const selected =
    value != null
      ? (items?.find((item) => getKey(item) === selectedKey) ?? value)
      : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal",
            selected == null && "text-muted-foreground",
            className,
          )}
          {...triggerProps}
        >
          {selected != null ? (
            (renderValue?.(selected) ?? (
              <span className="truncate">{getLabel(selected)}</span>
            ))
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent full={contentFull} className={cn("p-0", contentClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items?.map((item) => {
                const key = getKey(item);
                const isSelected = key === selectedKey;
                return (
                  <CommandItem
                    key={key}
                    value={getSearchValue(item)}
                    disabled={isItemDisabled?.(item)}
                    className={itemClassName}
                    onSelect={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    {renderItem?.(item, isSelected) ?? getLabel(item)}
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const Combobox = React.forwardRef(ComboboxInner) as <T>(
  props: ComboboxProps<T> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement;
