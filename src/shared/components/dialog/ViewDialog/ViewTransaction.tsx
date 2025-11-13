import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import * as Icon from "lucide-react";
import {
  AccordionItem,
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { formatCurrency, formatDate } from "@/shared/utils/CustomFunctions";
import DialogAccordion from "./Accordion";
import ViewImage from "./ViewImage";
import Expense from "@/assets/images/expense.svg";
import Income from "@/assets/images/income.svg";
import Transfer from "@/assets/images/transfer.svg";

const ViewTransaction = ({ transaction, open, setOpen }) => {
  console.log(transaction);
  if (!transaction) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "received":
      case "paid":
        return "success";
      case "partial":
      case "pending":
        return "warning";
      case "failed":
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "expense":
        return <Icon.TrendingDown className="h-5 w-5 text-red-500" />;
      case "income":
        return <Icon.TrendingUp className="h-5 w-5 text-green-500" />;
      case "transfer":
        return <Icon.ArrowRightLeft className="h-5 w-5 text-blue-500" />;
      default:
        return <Icon.DollarSign className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (iconName) => {
    const IconComponent = Icon[iconName];
    return <IconComponent className="h-5 w-5 text-black" />;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl flex flex-col h-dvh sm:max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              {getTypeIcon(transaction?.category?.type)}
              {transaction?.interval ? "Recurring " : "Transaction "}
               Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Main Transaction Info */}
            <div className="bg-secondary rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {getCategoryIcon(transaction.category?.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {transaction.category?.name}
                    </h3>
                    <p className="text-secondary-foreground">
                      {transaction.category?.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-3xl font-bold text-foreground">
                    {/* {transaction.category?.type === "Expense" ? "-" : "+"} */}
                    {formatCurrency(transaction.amount)}
                  </div>
                  {transaction?.status && (
                    <Badge variant={getStatusColor(transaction?.status)}>
                      {transaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon.Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {transaction?.interval && "Recurring "}ID
                    </p>
                    <p className="font-medium">#{transaction.id}</p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-3">
                <Icon.Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <p className="font-medium">
                    {transaction.asset?.name || "N/A"}
                  </p>
                </div>
              </div> */}

                {/* <div className="flex items-center gap-3">
                  <Icon.Repeat className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Recurring</p>
                    <p className="font-medium break-words">
                      {transaction.recurringTemplate ? "true" : "false"}
                    </p>
                  </div>
                </div> */}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon.Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(transaction.date || transaction?.startDate)}
                    </p>
                  </div>
                </div>
                {/* {transaction?.recurringTemplate && (
                  <div className="flex items-center gap-3">
                    <Icon.CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Auto</p>
                      <p className="font-medium">
                        {transaction?.recurringTemplate?.auto
                          ? "true"
                          : "false"}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon.FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium break-words">
                  {transaction.description}
                </p>
              </div>
            </div>
            {/* Transaction History */}
            <DialogAccordion
              transaction={transaction}
              getTypeIcon={getTypeIcon}
            />

            {/* Additional Details */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewTransaction;
