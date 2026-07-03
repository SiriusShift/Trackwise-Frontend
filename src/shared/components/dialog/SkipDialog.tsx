import { commonDialogProps } from "@/shared/types";
import * as LucideIcons from "lucide-react";
import moment from "moment";
import { Button } from "../ui/button";
import CommonDialog from "./CommonDialog";

interface BillDialogProps extends commonDialogProps {
  data: {
    category: {
      color: string;
      icon: string;
      name: string;
    };
    description: string;
    nextDueDate: string;
  };
}

const SkipDialog = ({ open, setOpen, data }: BillDialogProps) => {
  const iconName = data?.category?.icon as keyof typeof LucideIcons;
  const Icon =
    iconName && iconName in LucideIcons
      ? LucideIcons[iconName]
      : LucideIcons.CircleHelp;
  const pastDue = moment().isAfter(moment(data?.nextDueDate), "day");

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="Skip this bill cycle?"
      description="This cycle won't be logged as an expense."
      icon={LucideIcons.SkipForward}
    >
      <div className="p-4 space-y-1">
        <div className="rounded-xl border p-3">
          <div className="flex gap-3">
            <div
              className="flex p-3 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${data?.category?.color}20`,
                color: data?.category?.color,
              }}
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
                  due{" "}
                  {moment(data?.nextDueDate)
                    .format("MMMM DD, YYYY")
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.X width={15} />
          <p>No expense will be added to Bills for this cycle</p>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.Calendar width={15} />
          <p>
            Next due date moves to{" "}
            {moment(data?.nextDueDate).add(1, "month").format("MMMM DD, YYYY")}
          </p>
        </div>
        <div className="flex text-sm text-muted-foreground items-center gap-1">
          <LucideIcons.History width={15} />
          <p>This will show as Skipped in the bill's payment history</p>
        </div>
      </div>
      <div className="p-4 border-t flex flex-row justify-end gap-2">
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button>Skip this cycle</Button>
      </div>
    </CommonDialog>
  );
};

export default SkipDialog;
