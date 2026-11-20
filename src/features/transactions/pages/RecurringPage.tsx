import { IRootState } from "@/app/store";
import {
  useCancelRecurringMutation,
  useGetRecurringQuery,
  usePauseRecurringMutation,
  useResumeRecurringMutation,
} from "@/features/transactions/api/transaction/recurringApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { TransactionType } from "@/features/transactions/components/hooks/UseTransactionSubmit";
import RecurringRow, {
  RecurringListHeader,
} from "@/features/transactions/components/recurring/RecurringRow";
import { RECURRING_COLS } from "@/features/transactions/components/recurring/recurringColumns";
import { cn } from "@/lib/utils";
import CommonToolbar from "@/shared/components/CommonToolbar";
import ScheduleDialog from "@/shared/components/dialog/ScheduleDialog/ScheduleDialog";
import PageHeader from "@/shared/components/PageHeader";
import StatCard from "@/shared/components/StatCard";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useQuickActions } from "@/shared/quick-actions/QuickActionsProvider";
import {
  RecurringStatus,
  Schedule,
  ScheduledItem,
  ScheduleType,
} from "@/shared/types";
import {
  formatCurrency,
  handleCatchErrorMessage,
} from "@/shared/utils/CustomFunctions";
import { getMonthlyEquivalent } from "@/shared/utils/schedule";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CalendarPlus,
  Plus,
  Scale,
} from "lucide-react";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type TypeFilter = "All" | ScheduleType;

const TYPE_FILTERS: TypeFilter[] = ["All", "Expense", "Income", "Transfer"];

const STATUS_TABS: { value: RecurringStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "ENDED", label: "Ended" },
];

const EMPTY_COPY: Record<RecurringStatus, { title: string; body: string }> = {
  ACTIVE: {
    title: "No recurring transactions",
    body: "Use Add recurring to schedule bills, salary or transfers.",
  },
  PAUSED: {
    title: "Nothing paused",
    body: "Paused schedules stop logging and reminding until you resume them.",
  },
  ENDED: {
    title: "Nothing ended yet",
    body: "Schedules you stop, or that pass their end date, show up here.",
  },
};

const rowStatus = (schedule: Schedule): RecurringStatus =>
  schedule.isActive === false ? "ENDED" : (schedule.status ?? "ACTIVE");

// Sort key for "soonest first"; schedules without a due date go last.
const dueValue = (schedule: Schedule) =>
  schedule.nextDueDate ? moment(schedule.nextDueDate).valueOf() : Infinity;

type DueGroup = "overdue" | "week" | "later";

const DUE_GROUPS: { key: DueGroup; label: string; tone?: string }[] = [
  { key: "overdue", label: "Overdue", tone: "text-destructive" },
  { key: "week", label: "Due this week" },
  { key: "later", label: "Later" },
];

const dueGroup = (schedule: Schedule): DueGroup => {
  if (!schedule.nextDueDate) return "later";
  const due = moment(schedule.nextDueDate);
  if (due.isBefore(moment(), "day")) return "overdue";
  if (due.isSameOrBefore(moment().add(7, "days").endOf("day"))) return "week";
  return "later";
};

// ScheduleDialog reads the schedule by id; the rest is shown while it loads.
const toScheduledItem = (schedule: Schedule): ScheduledItem => ({
  key: `recurring-${schedule.id}`,
  source: "RECURRING",
  sourceId: schedule.id,
  type: schedule.type,
  description: schedule.description,
  amount: Number(schedule.amount),
  dueDate: moment(schedule.nextDueDate).toISOString(),
  behaviour: schedule.behaviour === "AUTO_LOG" ? "AUTO_LOG" : "REMIND",
  interval: Number(schedule.interval),
  unit: schedule.unit,
  daysOfMonth: schedule.daysOfMonth,
  startDate: schedule.startDate,
  category: schedule.category,
  fromAsset: schedule.fromAsset,
  toAsset: schedule.toAsset,
  projected: false,
  actionable: schedule.behaviour !== "AUTO_LOG",
  needsAttention: false,
});

const RecurringPage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { openAdd } = useQuickActions();
  const baseCurrency = useSelector(
    (state: IRootState) => state.settings.currency,
  );

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [statusTab, setStatusTab] = useState<RecurringStatus>("ACTIVE");
  const [viewing, setViewing] = useState<Schedule | null>(null);
  const [editing, setEditing] = useState<Schedule | null>(null);

  // One request for every status: lists are short, and the tabs need counts.
  const { data, isLoading, isError, refetch } = useGetRecurringQuery({
    status: "ALL",
  });
  const [cancelRecurring] = useCancelRecurringMutation();
  const [pauseRecurring] = usePauseRecurringMutation();
  const [resumeRecurring] = useResumeRecurringMutation();

  const byType = useMemo(
    () =>
      (data ?? []).filter(
        (schedule) => typeFilter === "All" || schedule.type === typeFilter,
      ),
    [data, typeFilter],
  );

  const counts = useMemo(() => {
    const result: Record<RecurringStatus, number> = {
      ACTIVE: 0,
      PAUSED: 0,
      ENDED: 0,
    };
    byType.forEach((schedule) => result[rowStatus(schedule)]++);
    return result;
  }, [byType]);

  const rows = useMemo(() => {
    const list = byType.filter((schedule) => rowStatus(schedule) === statusTab);
    // Ended: most recently ended first. Otherwise: soonest due first.
    return statusTab === "ENDED"
      ? list.sort(
          (a, b) =>
            moment(b.endedAt ?? b.endDate ?? b.nextDueDate).valueOf() -
            moment(a.endedAt ?? a.endDate ?? a.nextDueDate).valueOf(),
        )
      : list.sort((a, b) => dueValue(a) - dueValue(b));
  }, [byType, statusTab]);

  // Active tab is split by urgency; other tabs are one plain list.
  const sections = useMemo(() => {
    if (statusTab !== "ACTIVE") return [{ key: "all", label: "", tone: undefined, rows }];
    return DUE_GROUPS.map((group) => ({
      ...group,
      rows: rows.filter((schedule) => dueGroup(schedule) === group.key),
    })).filter((group) => group.rows.length > 0);
  }, [rows, statusTab]);

  // Monthly commitments from ACTIVE schedules in the base currency. Other
  // currencies can't be added without a rate, so they're counted separately.
  const summary = useMemo(() => {
    const weekEnd = moment().add(7, "days").endOf("day");
    let outflow = 0;
    let inflow = 0;
    let otherCurrency = 0;
    let dueThisWeek = 0;
    let overdue = 0;

    (data ?? [])
      .filter((schedule) => rowStatus(schedule) === "ACTIVE")
      .forEach((schedule) => {
        const due = moment(schedule.nextDueDate);
        if (due.isBefore(moment(), "day")) overdue++;
        else if (due.isSameOrBefore(weekEnd)) dueThisWeek++;

        if (schedule.type === "Transfer") return;
        const currency = schedule.fromAsset?.currency ?? baseCurrency;
        if (currency !== baseCurrency) {
          otherCurrency++;
          return;
        }
        const monthly = getMonthlyEquivalent(schedule);
        if (schedule.type === "Expense") outflow += monthly;
        else inflow += monthly;
      });

    return { outflow, inflow, net: inflow - outflow, otherCurrency, dueThisWeek, overdue };
  }, [data, baseCurrency]);

  const handleTogglePause = useCallback(
    async (schedule: Schedule) => {
      const paused = rowStatus(schedule) === "PAUSED";
      try {
        if (paused) {
          await resumeRecurring(schedule.id).unwrap();
          toast.success(`"${schedule.description}" resumed.`);
        } else {
          await pauseRecurring(schedule.id).unwrap();
          toast.success(`"${schedule.description}" paused.`, {
            description: "No transactions or reminders until you resume it.",
          });
        }
      } catch (err) {
        toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
      }
    },
    [pauseRecurring, resumeRecurring],
  );

  const handleCancel = useCallback(
    (schedule: Schedule) => {
      confirm({
        title: "Stop schedule",
        description: `Stop "${schedule.description}"? Transactions already created are kept, but no new ones will be scheduled. To stop it for a while instead, use Pause.`,
        variant: "warning",
        confirmText: "Stop",
        cancelText: "Keep",
        showLoadingOnConfirm: true,
        onConfirm: async () => {
          try {
            await cancelRecurring(schedule.id).unwrap();
            toast.success("Schedule stopped.");
          } catch (err) {
            toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
          }
        },
      });
    },
    [cancelRecurring, confirm],
  );

  const handleAdd = () =>
    openAdd((typeFilter === "All" ? "Expense" : typeFilter) as TransactionType, {
      recurring: true,
    });

  const money = (value: number) =>
    formatCurrency(value, baseCurrency, "symbol", 0);

  const stats = [
    {
      key: "out",
      title: "Bills per month",
      value: money(summary.outflow),
      icon: ArrowUpRight,
      color: "text-destructive bg-destructive/10",
      footer: summary.otherCurrency
        ? `Excludes ${summary.otherCurrency} in other currencies`
        : "Average across frequencies",
    },
    {
      key: "in",
      title: "Income per month",
      value: money(summary.inflow),
      icon: ArrowDownLeft,
      color: "text-success bg-success/10",
      footer: "From recurring income",
    },
    {
      key: "net",
      title: "Net per month",
      value: `${summary.net > 0 ? "+" : ""}${money(summary.net)}`,
      icon: Scale,
      color:
        summary.net < 0
          ? "text-destructive bg-destructive/10"
          : "text-primary bg-primary/10",
      footer: summary.net < 0 ? "Bills exceed recurring income" : "Left after bills",
    },
    {
      key: "due",
      title: "Due this week",
      value: String(summary.dueThisWeek),
      icon: CalendarClock,
      color: "text-warning bg-warning/10",
      footer: summary.overdue ? `${summary.overdue} overdue` : "Nothing overdue",
    },
  ];

  const empty = EMPTY_COPY[statusTab];
  // Something exists in this tab, just not for the selected type
  const hiddenByFilter =
    typeFilter !== "All" &&
    (data ?? []).some((schedule) => rowStatus(schedule) === statusTab);

  return (
    <>
      <CommonToolbar />
      <div className="flex flex-col gap-4 p-4 pb-24 sm:gap-5 sm:p-5 sm:pb-5">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 w-fit gap-1 px-2 text-xs text-muted-foreground"
            onClick={() => navigate("/transactions")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Transactions
          </Button>
          <PageHeader
            pageName="Recurring"
            description="Every bill, salary and transfer on a schedule"
            monthPicker={false}
          >
            <Button onClick={handleAdd}>
              <Plus />
              <span className="hidden sm:inline">Add recurring</span>
            </Button>
          </PageHeader>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map(({ key, ...stat }) => (
            <StatCard key={key} loading={isLoading} {...stat} />
          ))}
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <Tabs
              value={statusTab}
              onValueChange={(value) => setStatusTab(value as RecurringStatus)}
            >
              <TabsList aria-label="Schedule status" className="grid w-full grid-cols-3 sm:w-auto">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 px-3">
                    {tab.label}
                    {!isLoading && (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {counts[tab.value]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as TypeFilter)}
            >
              <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Transaction type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_FILTERS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All" ? "All types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <>
              <RecurringListHeader />
              <ul className="divide-y" aria-busy aria-label="Loading schedules">
                {[...Array(4)].map((_, i) => (
                  <li key={i} className={cn(RECURRING_COLS.row, "py-3")}>
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-40 max-w-full" />
                      <Skeleton className="h-3 w-28 max-w-full" />
                    </div>
                    <div className={cn(RECURRING_COLS.frequency, "flex-col gap-2")}>
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className={RECURRING_COLS.due}>
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className={cn(RECURRING_COLS.amount, "flex justify-end")}>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <span className={RECURRING_COLS.menu} />
                  </li>
                ))}
              </ul>
            </>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Couldn't load your recurring transactions.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <CalendarPlus className="h-5 w-5" />
              </span>
              {hiddenByFilter ? (
                <>
                  <div>
                    <p className="text-sm font-semibold">
                      No {typeFilter.toLowerCase()} schedules here
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                      Other types have schedules in this tab.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setTypeFilter("All")}>
                    Show all types
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold">{empty.title}</p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                      {empty.body}
                    </p>
                  </div>
                  {statusTab === "ACTIVE" && (
                    <Button variant="outline" size="sm" onClick={handleAdd}>
                      <Plus /> Add recurring
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <RecurringListHeader ended={statusTab === "ENDED"} />
              {sections.map((section) => (
                <section
                  key={section.key}
                  aria-label={section.label || undefined}
                  className="border-b last:border-b-0"
                >
                  {section.label && (
                    <h3
                      className={cn(
                        "flex items-center gap-2 bg-muted/20 px-4 pb-1.5 pt-3 text-xs font-semibold sm:px-5",
                        section.tone ?? "text-muted-foreground",
                      )}
                    >
                      {section.label}
                      <span className="font-normal tabular-nums text-muted-foreground">
                        {section.rows.length}
                      </span>
                    </h3>
                  )}
                  <ul className="divide-y">
                    {section.rows.map((schedule) => (
                      <RecurringRow
                        key={schedule.id}
                        schedule={schedule}
                        baseCurrency={baseCurrency}
                        onView={setViewing}
                        onEdit={setEditing}
                        onTogglePause={handleTogglePause}
                        onCancel={handleCancel}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </>
          )}
        </Card>
      </div>

      <ScheduleDialog
        open={!!viewing}
        setOpen={(open: boolean) => !open && setViewing(null)}
        data={viewing ? toScheduledItem(viewing) : null}
      />

      {editing && (
        <TransactionDialog
          key={editing.id}
          open={!!editing}
          setOpen={(open: boolean) => !open && setEditing(null)}
          mode="edit"
          type={editing.type as TransactionType}
          rowData={editing}
        />
      )}
    </>
  );
};

export default RecurringPage;
