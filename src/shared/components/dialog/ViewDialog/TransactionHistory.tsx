import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { formatDate } from "@/shared/utils/CustomFunctions";
import { Button } from "../../ui/button";
import { Paperclip, Pencil, Eye, Trash } from "lucide-react";

const TransactionHistory = ({ history, setImageOpen, setOpen }) => {
  return (
    <>
      <div
        key={history?.id}
        className="bg-background dark:bg-secondary/50 border border-border/50 hover:border-border transition-colors duration-200 rounded-xl p-5 shadow-sm hover:shadow-md"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {/* <div className="p-2 border rounded-lg">
              {getTypeIcon(history.transactionType)}
            </div> */}
            <div>
              <span className="font-semibold text-foreground text-base">
                {history?.transactionType}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transaction #{history?.id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`font-bold text-lg ${
                history?.transactionType === "Expense"
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {history?.transactionType === "Expense" ? "-" : "+"}
              {formatCurrency(history?.amount)}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Date Paid:
            </span>
            <span className="text-foreground font-medium">
              {formatDate(history?.date)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Source:</span>
            <span className="text-foreground font-medium">
              {history?.fromAsset?.name}
            </span>
          </div>

          {history?.description && (
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium text-sm">
                Description:
              </span>
              <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                {history?.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
          {history?.image && (
            <Button
              onClick={() => setImageOpen(history?.image)}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/50"
            >
              <Paperclip className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
          )}
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/50"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/50"
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
