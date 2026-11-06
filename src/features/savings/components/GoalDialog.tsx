import { AccountSelect } from "@/features/transactions/components/forms/section/AccountSelect";
import { cn } from "@/lib/utils";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import DatePicker from "@/shared/components/dialog/DatePicker";
import IconPicker from "@/shared/components/IconPicker";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { commonDialogProps, Field } from "@/shared/types";
import {
  handleCatchErrorMessage,
  numberInput,
} from "@/shared/utils/CustomFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, icons, Target } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateGoalMutation,
  useGetSavingsQuery,
  useUpdateGoalMutation,
} from "../api/savingsApi";
import { GoalForm, goalSchema } from "../schema/goal.schema";
import { GoalPayload, SavingsData } from "../types/savings.types";

// Liabilities can't back a goal (the backend rejects them)
const GOAL_ACCOUNT_CATEGORIES = ["CASH", "BANK", "INVESTMENT"];

interface GoalDialogProps extends commonDialogProps {
  // null creates a new goal
  goal: SavingsData | null;
  onSaved?: (goal: SavingsData) => void;
}

const GoalDialog = ({ open, setOpen, goal, onSaved }: GoalDialogProps) => {
  const [openDate, setOpenDate] = useState(false);
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const { data: accountsData } = useGetAccountsQuery();
  // Same args as the page, so this reads the cached list
  const { data: savingsData } = useGetSavingsQuery({});
  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();

  const isEdit = goal != null;

  // An account backs one goal at most, archived goals included, so hide ones
  // other goals already use
  const linkedElsewhere = new Set(
    (savingsData?.data ?? [])
      .filter((saving) => saving.id !== goal?.id && saving.assetId != null)
      .map((saving) => saving.assetId),
  );
  const assets = (accountsData?.data ?? []).filter(
    (asset: { id: number }) => !linkedElsewhere.has(asset.id),
  );

  const form = useForm<GoalForm>({
    resolver: zodResolver(goalSchema.schema) as Resolver<GoalForm>,
    mode: "onChange",
    defaultValues: goalSchema.defaultValues as never,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  // Fresh form on every open: the goal's values when editing, defaults otherwise
  useEffect(() => {
    if (!open) return;
    reset(
      (goal
        ? {
            name: goal.name,
            targetAmount: Number(goal.targetAmount),
            targetDate: goal.targetDate ? moment(goal.targetDate).toDate() : null,
            icon: goal.icon,
            isLinked: goal.assetId != null,
            account: goal.asset ?? null,
            // Starts an unlinked edit from what the goal shows as saved
            currentAmount: goal.savedAmount,
          }
        : goalSchema.defaultValues) as never,
    );
  }, [open, goal, reset]);

  const isLinked = watch("isLinked");

  const onSubmit = async (values: GoalForm) => {
    const data: GoalPayload = {
      name: values.name.trim(),
      targetAmount: Number(values.targetAmount),
      targetDate: values.targetDate
        ? moment(values.targetDate).startOf("day").toISOString()
        : null,
      icon: values.icon,
      assetId: values.isLinked ? Number(values.account?.id) : null,
      ...(!values.isLinked && {
        currentAmount: Number(values.currentAmount ?? 0),
      }),
    };
    try {
      const result = isEdit
        ? await updateGoal({ id: goal.id, data }).unwrap()
        : await createGoal(data).unwrap();
      toast.success(
        isEdit ? `${data.name} updated.` : `${data.name} created.`,
      );
      onSaved?.(result.data);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  const busy = isSubmitting || isCreating || isUpdating;

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      isDirty={isDirty}
      reset={reset}
      title={isEdit ? `Edit ${goal.name}` : "New goal"}
      description={
        isEdit
          ? "Change the target, due date, or how progress is tracked."
          : "Set a target and how you'll track progress toward it."
      }
      icon={Target}
      preventClickOutside
    >
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {/* Icon and name */}
            <div className="flex items-start gap-3">
              <FormField
                control={control}
                name="icon"
                render={({ field }) => {
                  const Icon =
                    icons[field.value as keyof typeof icons] ?? icons.PiggyBank;
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setOpenIconPicker(true)}
                          aria-label={`Change icon, currently ${field.value}`}
                        >
                          <Icon />
                        </Button>
                      </FormControl>
                      <IconPicker
                        open={openIconPicker}
                        setOpen={setOpenIconPicker}
                        value={field.value}
                        onChange={(icon) =>
                          setValue("icon", icon, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Emergency fund"
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Target */}
              <FormField
                name="targetAmount"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Target <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₱
                        </span>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          onChange={(e) => numberInput(e, field)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due date */}
              <FormField
                control={control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Due date{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setOpenDate(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value
                        ? moment(field.value).format("MMM DD, YYYY")
                        : "No due date"}
                    </Button>
                    <DatePicker
                      open={openDate}
                      setOpen={setOpenDate}
                      removeTime
                      disablePast
                      clearable
                      // Field's value type doesn't allow null; clearing sets it
                      field={field as Field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">
              Pace and goal health are only tracked for goals with a due date.
            </p>

            {/* Tracking */}
            <FormField
              control={control}
              name="isLinked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-3 rounded-xl border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Track with an account</FormLabel>
                    <FormDescription className="text-xs">
                      {field.value
                        ? "Saved amount follows the account's balance, and you can contribute and withdraw."
                        : "You'll update the saved amount by hand."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        setValue("isLinked", checked, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isLinked ? (
              <AccountSelect
                name="account"
                label="Account"
                assets={assets}
                control={control}
                categories={GOAL_ACCOUNT_CATEGORIES}
              />
            ) : (
              <FormField
                name="currentAmount"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saved so far</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₱
                        </span>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          onChange={(e) => numberInput(e, field)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 border-t p-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !isValid}>
              {busy
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create goal"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CommonDialog>
  );
};

export default GoalDialog;
