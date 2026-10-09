import { useSkipRecurringScheduleMutation } from "@/features/transactions/api/transaction/schedulesApi";
import { commonDialogProps } from "@/shared/types";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import {
  getNextDuePreview,
  getScheduleColor,
  getScheduleIcon,
} from "@/shared/utils/schedule";
import * as LucideIcons from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CommonDialog from "./CommonDialog";
import { PayTarget } from "./PayDialog";

interface SkipDialogProps extends commonDialogProps {
  data?: PayTarget | null;
}

const SkipDialog = ({ open, setOpen, data }: SkipDialogProps) => {
  const Icon = getScheduleIcon(data);
  const color = getScheduleColor(data);
  const pastDue = moment().isAfter(moment(data?.dueDate), "day");
  const typeLabel = data?.type?.toLowerCase() ?? "transaction";

  const [triggerSkip, { isLoading }] = useSkipRecurringScheduleMutation();

  const onSubmit = async () => {
    if (!data) return;
    try {
      await triggerSkip(data.id).unwrap();
      toast.success(`${data.description} skipped for this cycle.`);
      setOpen(false);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err) ?? "Something went wrong.");
    }
  };

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="Skip this cycle?"
      description={`This cycle won't be logged as ${typeLabel === "transfer" ? "a" : "an"} ${typeLabel}.`}
      icon={LucideIcons.SkipForward}
    >
      <div className="p-4 space-y-1">
        <div className="rounded-xl border p-3">
          <div className="flex gap-3">
            <div
              className="flex p-3 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold">{data?.description}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate">{data?.category?.name}</span>
                <span aria-hidden="true" className="shrink-0">
                  ·
                </span>
                <span>
                  {pastDue && "was "}
                  due {moment(data?.dueDate).format("MMMM DD, YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.X width={15} />
          <p>No {typeLabel} will be recorded for this cycle</p>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.Calendar width={15} />
          <p>
            Next due date moves to{" "}
            {getNextDuePreview(data?.dueDate, data?.interval, data?.unit)}
          </p>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.History width={15} />
          <p>This will show as Skipped in the schedule's history</p>
        </div>
      </div>
      <div className="p-4 border-t flex flex-row justify-end gap-2">
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Skipping..." : "Skip this cycle"}
        </Button>
      </div>
    </CommonDialog>
  );
};

export default SkipDialog;
