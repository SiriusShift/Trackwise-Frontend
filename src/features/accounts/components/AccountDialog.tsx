import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus, Wallet } from "lucide-react";
import { useEffect } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";

import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
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
import { toast } from "sonner";

import { IRootState } from "@/app/store";
import { cn } from "@/lib/utils";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from "@/shared/api/accountsApi";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import currencyCodes from "currency-codes";
import { useSelector } from "react-redux";
import { ACCOUNT_SUBTYPES, ACCOUNT_TYPES, ICON_OPTIONS } from "../constants";
import { accountSchema } from "../schema/account.schema";
import {
  AccountCategory,
  AccountDialogProps,
  AccountFormValues,
} from "../types/account.types";

const ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map((opt) => [opt.value, opt.Icon]),
) as Record<string, (typeof ICON_OPTIONS)[number]["Icon"]>;

// A fixed swatch palette rather than a free-form color input — keeps every
// account card visually consistent instead of users picking near-duplicate
// shades. Stored as Asset.color (hex string).
const COLOR_OPTIONS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#a855f7", // purple
  "#ec4899", // pink
] as const;

// Small helper so required labels are visually consistent everywhere.
const RequiredMark = () => (
  <span className="text-destructive ml-0.5" aria-hidden="true">
    *
  </span>
);

// Field names match CreditDetail (schema.prisma) exactly — statementDate/
// dueDate, not statementDay/dueDay — so the onSubmit reshape below is a
// straight passthrough instead of a renaming trap.

// Sensible default matching Trackwise's PHP-first convention — the currency
// combobox still requires an explicit selection to submit, this just avoids
// forcing every new account to start on an empty/invalid value.

const AccountDialog = ({
  open,
  setOpen,
  mode,
  account,
}: AccountDialogProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const isEdit = mode === "edit";

  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "",
      sub_type: "",
      includeNetWorth: false,
      balance: 0,
      color: COLOR_OPTIONS[0],
      icon: ICON_OPTIONS[0].value,
      currency: currencyCodes?.data?.find((item) => item?.code === currency),
    },
  });

  const {
    watch,
    control,
    setValue,
    reset,
    formState: { isValid },
  } = form;

  console.log(watch());

  const accountType = watch("type") as AccountCategory;
  const selectedColor = watch("color");
  const selectedIcon = watch("icon");
  const subtypeOptions =
    accountType in ACCOUNT_SUBTYPES
      ? ACCOUNT_SUBTYPES[accountType as keyof typeof ACCOUNT_SUBTYPES]
      : [];
  const hasSubtypes = subtypeOptions.length > 0;

  // Clear subtype whenever it no longer belongs to the selected category
  // (e.g. switching CREDIT -> CASH shouldn't leave "CREDIT_CARD" saved).
  // Also clear credit-only fields when leaving CREDIT, so stale values
  // don't get silently resubmitted after a type switch.
  useEffect(() => {
    if (!hasSubtypes) {
      setValue("sub_type", undefined);
    } else {
      const currentSubType = form.getValues("sub_type");
      const stillValid = subtypeOptions.some((o) => o.value === currentSubType);
      if (!stillValid) {
        setValue("sub_type", undefined);
      }
    }

    if (accountType !== "CREDIT") {
      setValue("creditLimit", undefined);
      setValue("statementDate", undefined);
      setValue("dueDate", undefined);
      setValue("minimumPayment", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  // Reset form with account data when opening in edit mode.
  // Previously this only restored name/type/sub_type/currency/balance —
  // institution, the credit fields, and includeNetWorth were left commented
  // out, so editing an existing account silently dropped them from the form.
  // Restoring color/icon here too, now that they exist.
  useEffect(() => {
    if (open) {
      if (isEdit && account) {
        form.reset({
          name: account.name,
          type: account.type,
          sub_type: account.sub_type,
          currency: account.currency,
          balance: String(account.balance),
          institution: account.institution,
          creditLimit: account.creditLimit,
          statementDate: account.statementDate,
          dueDate: account.dueDate,
          minimumPayment: account.minimumPayment,
          color: account.color ?? COLOR_OPTIONS[0],
          icon: account.icon ?? ICON_OPTIONS[0].value,
          includeNetWorth: account.includeNetWorth,
        });
      } else {
        reset();
      }
    }
  }, [open, isEdit, account, form]);

  const onSubmit = async (values: AccountFormValues) => {
    try {
      const { creditLimit, statementDate, dueDate, minimumPayment, ...rest } =
        values;

      const payload = {
        ...rest,
        balance: Number(values.balance),
        currency: values.currency.code, // Asset.currency is a plain ISO code string, not the full currency-codes object
        // CreditDetail is a separate related model on the backend — nest it
        // here rather than sending flat columns that don't exist on Asset.
        ...(values.type === "CREDIT" && {
          creditDetail: {
            creditLimit,
            statementDate,
            dueDate,
            minimumPayment,
          },
        }),
      };

      if (isEdit && account) {
        await updateAccount({ id: account.id, ...payload }).unwrap();
        toast.success("Account updated successfully");
      } else {
        await createAccount(payload).unwrap();
        toast.success("Account created successfully");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update account" : "Failed to create account",
      );
    }
  };

  const SelectedIcon = ICON_MAP[selectedIcon ?? ICON_OPTIONS[0].value];

  return (
    <CommonDialog
      icon={Wallet}
      open={open}
      setOpen={setOpen}
      title={`${mode} Account`}
      description={
        mode === "Add"
          ? "Add a new account to manage your finances"
          : "Update your account details and preferences."
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 px-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="BPI Savings" {...field} />
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
                  <FormLabel>
                    Type
                    <RequiredMark />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="sub_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subtype
                    {hasSubtypes && <RequiredMark />}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10" disabled={!hasSubtypes}>
                        <SelectValue placeholder="Select subtype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subtypeOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="currency"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>
                    Currency
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !value && "text-muted-foreground",
                            )}
                          >
                            {value?.currency || "Select currency"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search currency..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {currencyCodes?.data?.map((currency, index) => (
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
                                        : "opacity-0",
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
          </div>

          <FormField
            control={control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEdit ? "Current Balance" : "Starting Balance"}
                  <RequiredMark />
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₱
                    </span>

                    <Input
                      className="pl-7"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Institution is a general Asset field (not credit-specific), always optional */}
          {accountType && accountType !== "CASH" && (
            <FormField
              control={control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="BPI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Icon + color are plain Asset fields — apply to every account type,
              used for card/list identification (avatar swatch + icon). */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 h-10"
                        >
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${selectedColor ?? COLOR_OPTIONS[0]}20`,
                            }}
                          >
                            <SelectedIcon
                              className="h-3.5 w-3.5"
                              style={{
                                color: selectedColor ?? COLOR_OPTIONS[0],
                              }}
                            />
                          </span>
                          {ICON_OPTIONS.find((o) => o.value === field.value)
                            ?.label ?? "Select icon"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <div className="grid grid-cols-5 gap-1.5">
                        {ICON_OPTIONS.map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            title={label}
                            onClick={() => field.onChange(value)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-muted",
                              field.value === value
                                ? "border-primary bg-muted"
                                : "border-transparent",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="color"
              render={({ field }) => {
                const isCustomColor =
                  !!field.value &&
                  !COLOR_OPTIONS.includes(
                    field.value as (typeof COLOR_OPTIONS)[number],
                  );

                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex h-10 flex-wrap items-center gap-1.5">
                        {COLOR_OPTIONS.map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            title={hex}
                            onClick={() => field.onChange(hex)}
                            className={cn(
                              "h-6 w-6 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                              field.value === hex
                                ? "ring-2 ring-primary"
                                : "ring-1 ring-border",
                            )}
                            style={{ backgroundColor: hex }}
                          />
                        ))}

                        {/* Custom swatch — opens a react-colorful picker for any
                            hex, not just the presets above. Shown as the actual
                            picked color once one is chosen; otherwise a rainbow
                            ring with a "+" hints that it's the custom option. */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              title={
                                isCustomColor ? field.value : "Custom color"
                              }
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
                                isCustomColor
                                  ? "ring-2 ring-primary"
                                  : "ring-1 ring-border",
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
                              className="w-full rounded-md border bg-background px-2 py-1 text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-primary"
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
          </div>

          {accountType === "CREDIT" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Credit Limit
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₱
                          </span>
                          <Input
                            className="pl-7"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseFloat(e.target.value),
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="minimumPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Payment</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₱
                          </span>
                          <Input
                            className="pl-7"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseFloat(e.target.value),
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="statementDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statement Date</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          placeholder="e.g. 15"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseInt(e.target.value, 10),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          placeholder="e.g. 5"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseInt(e.target.value, 10),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <FormField
            control={control}
            name="includeNetWorth"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
                  <FormControl>
                    <Checkbox
                      id="include-net-worth"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>

                  <div className="space-y-1">
                    <FormLabel
                      htmlFor="include-net-worth"
                      className="cursor-pointer text-sm font-medium leading-none"
                    >
                      Include this account when calculating your total net
                      worth.{" "}
                    </FormLabel>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </CommonDialog>
  );
};

export default AccountDialog;
