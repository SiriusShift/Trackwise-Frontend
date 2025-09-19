import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { formatDate } from "@/shared/utils/CustomFunctions";
import React from "react";
import { Button } from "../../ui/button";
import { Paperclip } from "lucide-react";

const TransactionHistory = ({ history, getTypeIcon, setImageOpen, isAuto }) => {
  return (
    <div key={history.id} className="bg-secondary rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(history.transactionType)}
          <span className="font-medium">{history.transactionType}</span>
        </div>
        <span className="font-bold">
          {history.transactionType === "Expense" ? "-" : "+"}
          {formatCurrency(history.amount)}
        </span>
      </div>
      <div className="flex flex-row">
        <div className="w-full">
          {" "}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-secondary-foreground">
                <strong className="text-muted-foreground">History ID:</strong> #
                {history.id}
              </p>
            </div>
            <div>
              <p className="text-secondary-foreground">
                <strong className="text-muted-foreground">Paid:</strong>{" "}
                {formatDate(history.date)}
              </p>
            </div>
          </div>
          {isAuto && (
            <p className="text-sm text-secondary-foreground mt-2">
              <strong className="text-muted-foreground">Description:</strong>{" "}
              {history.description}
            </p>
          )}
        </div>
        {history?.image && (
          <Button
            onClick={() => setImageOpen(true)}
            variant={"outline"}
            className="w-10 flex-1 h-10"
          >
            <Paperclip />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
