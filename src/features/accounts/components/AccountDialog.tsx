import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { commonDialogProps } from "@/shared/types";
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

const ACCOUNT_TYPES = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank Account" },
  { value: "CREDIT", label: "Credit" },
  { value: "LOAN", label: "Loan" },
  { value: "INVESTMENT", label: "Investment" },
] as const;

// Keyed by AssetCategory — CASH intentionally has no entry (no subtype),
// matching the AssetSubtype mapping documented in schema.prisma.
const ACCOUNT_SUBTYPES = {
  BANK: [
    { value: "SAVINGS", label: "Savings" },
    { value: "CHECKING", label: "Checking" },
    { value: "E_WALLET", label: "E-Wallet" },
  ],
  CREDIT: [
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "LINE_OF_CREDIT", label: "Line of Credit" },
  ],
  LOAN: [
    { value: "PERSONAL", label: "Personal Loan" },
    { value: "HOME", label: "Home Loan" },
    { value: "AUTO", label: "Auto Loan" },
  ],
  INVESTMENT: [
    { value: "STOCK", label: "Stock" },
    { value: "ETF", label: "ETF" },
    { value: "CRYPTO", label: "Crypto" },
    { value: "MUTUAL_FUND", label: "Mutual Fund" },
    { value: "BOND", label: "Bond" },
  ],
} as const;

type AccountCategory = keyof typeof ACCOUNT_SUBTYPES | "CASH";

// Small helper so required labels are visually consistent everywhere.
const RequiredMark = () => (
  <span className="text-destructive ml-0.5" aria-hidden="true">
    *
  </span>
);

// Field names match CreditDetail (schema.prisma) exactly — statementDate/
// dueDate, not statementDay/dueDay — so the onSubmit reshape below is a
// straight passthrough instead of a renaming trap.
const accountSchema = z
  .object({
    name: z.string().min(1, "Account name is required"),
    type: z.enum(["CASH", "BANK", "CREDIT", "LOAN", "INVESTMENT"]),
    sub_type: z.string().optional(),
    currency: z.object({
      code: z.string(),
      currency: z.string(),
      digits: z.number(),
      number: z.string(),
    }),
    balance: z
      .number()
      .positive()
      .refine((v) => !isNaN(Number(v)), "Must be a valid number"),

    // Lives on Asset itself (institution: String?) — applies to any account
    // type, not just credit. Always optional.
    institution: z.string().optional(),

    // Mirrors CreditDetail: only creditLimit is non-nullable there.
    creditLimit: z.number().positive().optional(),
    statementDate: z.number().int().min(1).max(31).optional(),
    dueDate: z.number().int().min(1).max(31).optional(),
    minimumPayment: z.number().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "CASH" && !data.sub_type?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sub_type"],
        message: "Sub type is required",
      });
    }

    if (data.type === "CREDIT" && data.creditLimit == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creditLimit"],
        message: "Credit limit is required",
      });
    }
  });
type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountData extends AccountFormValues {
  id: string;
}

interface AccountDialogProps extends commonDialogProps {
  mode: string;
  account?: AccountData;
}

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
  const isEdit = mode === "Edit";

  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "",
      balance: 0,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  // Reset form with account data when opening in edit mode
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
