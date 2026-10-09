import { IRootState } from "@/app/store";
import {
  useGetRecurringScheduleHistoryQuery,
  useGetRecurringScheduleQuery,
} from "@/features/transactions/api/transaction/schedulesApi";
import { cn } from "@/lib/utils";
import { ScheduledItem } from "@/shared/types";
import { formatCurrency, getStatus } from "@/shared/utils/CustomFunctions";
import {
  getFrequencyLabel,
  getNextDuePreview,
  getScheduleIcon,
  scheduleActionLabels,
} from "@/shared/utils/schedule";
import * as LucideIcons from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { PayTarget } from "../PayDialog";
import { InfoRow } from "../ViewDialog/InfoRow";
import ButtonSkeleton from "./ButtonSkeleton";
import InfoSkeleton from "./InfoSkeleton";

interface RecurringScheduleDetailsProps {
  item: ScheduledItem;
  onPay: (target: PayTarget) => void;
  onSkip: (target: PayTarget) => void;
}

const RecurringScheduleDetails = ({
  item,
  onPay,
  onSkip,
}: RecurringScheduleDetailsProps) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const id = item.sourceId ?? 0;

  const { currentData: schedule, isFetching: scheduleLoading } =
    useGetRecurringScheduleQuery(id, { skip: !id });
  const { currentData: history, isFetching: historyLoading } =
    useGetRecurringScheduleHistoryQuery(id, { skip: !id });

  // A projected cycle shows its own date; actions always apply to the
  // current cycle (schedule.nextDueDate).
  const shownDue = item.projected ? item.dueDate : schedule?.nextDueDate;
  const today = moment();
  const dueDate = shownDue ? moment(shownDue) : null;
  const isOverdue = dueDate?.isBefore(today, "day") ?? false;
  const isDueToday = dueDate?.isSame(today, "day") ?? false;
  const daysLate = dueDate ? today.diff(dueDate, "days") : 0;
  const status = getStatus(shownDue);

  const labels = scheduleActionLabels[item.type];
  const Icon = getScheduleIcon(item);
  const isAutoLog = schedule?.behaviour === "AUTO_LOG";

  const payTarget: PayTarget | null = schedule
    ? {
        source: "RECURRING",
        id: schedule.id,
        type: schedule.type,
        description: schedule.description,
        amount: schedule.amount,
        dueDate: schedule.nextDueDate,
        category: schedule.category,
        account: schedule.account,
        toAsset: schedule.type === "Transfer" ? schedule.toAsset : null,
        interval: schedule.interval,
        unit: schedule.unit,
      }
    : null;

  return (
    <>
      {scheduleLoading ? (
        <InfoSkeleton />
      ) : (
        <div className="p-4">
          <div className="flex flex-col items-center gap-3 pb-6">
            <div className="rounded-2xl border p-4">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold">
                {formatCurrency(schedule?.amount ?? item.amount, currency)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {schedule?.description ?? item.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {item.projected ? "Projected" : status.label}
                </Badge>
                {item.needsAttention && (
                  <Badge
                    variant="outline"
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-destructive"
                  >
                    Auto-log failed
                  </Badge>
                )}
              </div>

              {item.needsAttention && item.failureReason && (
                <p className="text-sm font-medium text-destructive">
                  {item.failureReason}
                </p>
              )}

              {!item.projected && isOverdue && (
                <p className="text-sm font-medium text-muted-foreground">
                  {daysLate} {daysLate === 1 ? "day" : "days"} overdue
                </p>
              )}

              {!item.projected && isDueToday && (
                <p className="text-sm font-medium text-muted-foreground">
                  Due today
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <InfoRow
              icon={LucideIcons.Calendar1}
              label="Due Date"
              value={dueDate?.format("MMMM DD, YYYY")}
            />
            <Separator />
            {item.type === "Transfer" ? (
              <>
                <InfoRow
                  icon={LucideIcons.ArrowUpRight}
                  label="From"
                  value={schedule?.fromAsset?.name}
                />
                <Separator />
                <InfoRow
                  icon={LucideIcons.ArrowDownLeft}
                  label="To"
                  value={schedule?.toAsset?.name}
                />
              </>
            ) : (
              <InfoRow
                icon={LucideIcons.Wallet}
                label={item.type === "Income" ? "To Account" : "Account"}
                value={schedule?.account?.name}
              />
            )}
            <Separator />
            <InfoRow
              icon={LucideIcons.Tag}
              label="Category"
              value={schedule?.category?.name}
            />
            <Separator />
            <InfoRow
              icon={LucideIcons.Repeat}
              label="Schedule"
              value={{
                behaviour: schedule?.behaviour,
                label: getFrequencyLabel(schedule?.interval, schedule?.unit),
              }}
            />
            <Separator />
            <InfoRow
              icon={LucideIcons.CalendarClock}
              label={
                item.projected
                  ? "Current cycle due"
                  : `Next due date (if ${labels.done.toLowerCase()} now)`
              }
              value={
                item.projected
                  ? moment(schedule?.nextDueDate).format("MMMM DD, YYYY")
                  : getNextDuePreview(
                      schedule?.nextDueDate,
                      schedule?.interval,
                      schedule?.unit,
                    )
              }
            />
            {schedule?.endDate && (
              <>
                <Separator />
                <InfoRow
                  icon={LucideIcons.CalendarOff}
                  label="Ends"
                  value={moment(schedule.endDate).format("MMMM DD, YYYY")}
                />
              </>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="mb-3 text-sm font-bold">History</h2>

        {historyLoading ? (
          <div className="space-y-3">
            <div className="animate-pulse rounded-xl border p-4 space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
        ) : history?.length ? (
          <div className="space-y-3">
            {history.map((entry) => {
              const isSkipped = entry.status === "Skipped";
              const due = entry.dueDate;
              const late =
                !isSkipped && due ? moment(entry.date).diff(due, "days") : 0;

              return (
                <div
                  key={entry.key}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-full p-2",
                        isSkipped ? "bg-muted" : "bg-primary/10",
                      )}
                    >
                      {isSkipped ? (
                        <LucideIcons.CalendarX className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <LucideIcons.CalendarCheck className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm">
                        {moment(isSkipped ? due : entry.date).format(
                          "MMMM DD, YYYY",
                        )}
                      </p>
                      <p className="font-medium text-xs text-muted-foreground">
                        {isSkipped
                          ? "Skipped"
                          : late > 0
                            ? `${late} ${late > 1 ? "days" : "day"} late`
                            : `${labels.done} on time`}
                      </p>
                    </div>
                  </div>

                  <p
                    className={cn(
                      "font-medium",
                      isSkipped && "text-muted-foreground line-through",
                    )}
                  >
                    {formatCurrency(entry.amount, currency)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center">
            <h3>Nothing recorded yet</h3>
          </div>
        )}
      </div>

      {scheduleLoading ? (
        <ButtonSkeleton />
      ) : (
        <div className="p-3 flex items-center justify-end gap-3 bg-card sticky bottom-0 border-t">
          {item.projected ? (
            <p className="mr-auto text-xs text-muted-foreground">
              Future cycle. Actions apply once it's the current one.
            </p>
          ) : isAutoLog && !item.needsAttention ? (
            <p className="mr-auto text-xs text-muted-foreground">
              Logged automatically on the due date.
            </p>
          ) : null}
          <Button
            variant={"outline"}
            disabled={!payTarget || item.projected}
            onClick={() => payTarget && onSkip(payTarget)}
          >
            Skip
          </Button>
          <Button
            disabled={!payTarget || item.projected}
            onClick={() => payTarget && onPay(payTarget)}
          >
            {labels.action}
          </Button>
        </div>
      )}
    </>
  );
};

export default RecurringScheduleDetails;
