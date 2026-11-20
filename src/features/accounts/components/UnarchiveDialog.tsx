import { useArchiveAccountMutation } from "@/shared/api/accountsApi";
import CommonDialog from "@/shared/components/dialog/CommonDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useDateFormat } from "@/shared/hooks/useDateFormat";
import {
  formatCurrency,
  handleCatchErrorMessage,
} from "@/shared/utils/CustomFunctions";
import { ArchiveRestore } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Account, PausedRecurring } from "../types/account.types";

type Choice = "keep" | "end";

interface UnarchiveDialogProps {
  account: Account | null;
  onClose: () => void;
}

const kindLabel = (item: PausedRecurring, accountId: number) => {
  if (item.type !== "Transfer") return item.type;
  return item.fromAsset?.id === accountId
    ? `Transfer to ${item.toAsset?.name ?? "another account"}`
    : `Transfer from ${item.fromAsset?.name ?? "another account"}`;
};

// What happens to an item the user keeps
const outcomeLabel = (item: PausedRecurring, dateFormat: string) => {
  switch (item.resume.action) {
    case "RESUMES":
      return `Resumes on ${moment(item.resume.nextDueDate).format(dateFormat)}`;
    case "ENDS":
      return "Ends, since it's past its end date";
    default:
      return `Stays paused until ${item.resume.blockedBy} is unarchived`;
  }
};

const UnarchiveDialog = ({ account, onClose }: UnarchiveDialogProps) => {
  const { dateFormat } = useDateFormat();
  const [unarchive, { isLoading }] = useArchiveAccountMutation();
  const [choices, setChoices] = useState<Record<number, Choice>>({});

  // Fresh choices for each account
  useEffect(() => setChoices({}), [account?.id]);

  const items = account?.pausedRecurring ?? [];

  const handleUnarchive = async () => {
    if (!account) return;
    const end = items
      .filter((item) => choices[item.id] === "end")
      .map((item) => item.id);

    try {
      await unarchive({ id: account.id, archived: false, end }).unwrap();
      toast.success(`${account.name} unarchived.`);
      onClose();
    } catch (err) {
      toast.error(handleCatchErrorMessage(err));
    }
  };

  return (
    <CommonDialog
      open={!!account}
      setOpen={(open) => !open && !isLoading && onClose()}
      title={`Unarchive ${account?.name ?? "account"}`}
      description="It goes back to your accounts and net worth."
      icon={ArchiveRestore}
    >
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recurring items were paused with this account.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {items.length} recurring{" "}
              {items.length === 1 ? "item was" : "items were"} paused with this
              account. Kept items continue on their usual schedule from today;
              the ones missed while it was archived aren't logged.
            </p>
            <ul className="divide-y rounded-md border">
              {items.map((item) => {
                const choice = choices[item.id] ?? "keep";
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.description}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {kindLabel(item, account!.id)} ·{" "}
                        {formatCurrency(
                          Number(item.amount),
                          account!.currency,
                          "symbol",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {choice === "end"
                          ? "Will be ended"
                          : outcomeLabel(item, dateFormat)}
                      </p>
                    </div>
                    {item.resume.action !== "ENDS" && (
                      <Select
                        value={choice}
                        onValueChange={(value) =>
                          setChoices((prev) => ({
                            ...prev,
                            [item.id]: value as Choice,
                          }))
                        }
                      >
                        <SelectTrigger
                          className="w-24 shrink-0"
                          aria-label={`What to do with ${item.description}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t px-6 py-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleUnarchive} disabled={isLoading}>
          {isLoading ? "Unarchiving..." : "Unarchive"}
        </Button>
      </div>
    </CommonDialog>
  );
};

export default UnarchiveDialog;
