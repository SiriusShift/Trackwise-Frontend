import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Wallet } from "lucide-react";
import { useEffect } from "react";
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
import {
  COLOR_OPTIONS,
  FormColorPicker,
} from "@/shared/components/FormColorPicker";
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
    mode: "onChange", // without this, isValid stays false on a fresh form and the submit button never enables
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

  const accountType = watch("type") as AccountCategory;
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
      setValue("minimumPayment", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  // Reset form with account data when opening in edit mode.
  useEffect(() => {
    if (open) {
      if (isEdit && account) {
        form.reset({
          name: account.name,
          type: account.type,
          sub_type: account.sub_type,
          currency: account.currency,
          balance: Number(account.balance),
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
      const {
        creditLimit,
        statementDate,
        dueDate,
        minimumPayment,
        minimumPaymentPercent,
        ...rest
      } = values;

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
            minimumPaymentPercent,
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
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        (isEdit ? "Failed to update account" : "Failed to create account");
      toast.error(message);
    }
  };

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
          className="space-y-2 px-6  max-h-[90%] overflow-auto"
        >
          <div className="py-4 flex flex-col gap-4">
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
                                {currencyCodes?.data?.map((currency) => (
                                  <CommandItem
                                    value={`${currency?.currency} ${currency?.code}`}
                                    key={currency?.code}
                                    onSelect={() => onChange(currency)}
                                  >
                                    {`${currency?.currency} (${currency?.code})`}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        currency?.code === value?.code
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

            {accountType === "CREDIT" && (
              <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Credit Card Details
                </p>

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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="minimumPaymentPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Payment %</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              %
                            </span>
                            <Input
                              className="pl-7"
                              type="number"
                              step="0.01"
                              placeholder="0"
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
                    name="minimumPaymentFloor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Payment Floor</FormLabel>
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

            <FormColorPicker control={control} name="color" label="Color" />

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
                        worth.
                      </FormLabel>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 -mx-6  flex justify-end gap-2 border-t bg-background px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
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
