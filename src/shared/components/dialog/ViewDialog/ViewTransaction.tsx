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
import { Button } from "../../ui/button";

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
        return (
          <div className="p-3 bg-red-100 rounded-xl">
            <Icon.ArrowUp className="h-5 w-5 text-red-500" />
          </div>
        );
      case "income":
        return (
          <div className="p-3 bg-green-100 rounded-xl">
            <Icon.ArrowDown className="h-5 w-5 text-green-500" />
          </div>
        );
      case "transfer":
        return (
          <div className="p-3 bg-blue-100 rounded-xl">
            <Icon.ArrowRightLeft className="h-5 w-5 text-blue-500" />
          </div>
        );
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
        <DialogContent
          className="max-w-2xl flex flex-col h-dvh sm:max-h-[90vh] overflow-y-auto p-0"
          removeClose
        >
          <DialogHeader className="p-4 border-b flex flex-row justify-between">
            <DialogTitle className="font-bold flex items-center gap-3">
              <Icon.ReceiptText />
              {transaction?.interval ? "Recurring " : "Transaction "}
              details
            </DialogTitle>
            <Button variant={"outline"} size={"sm"}>
              <Icon.X />
            </Button>
          </DialogHeader>

          <div className="space-y-6 p-4">
            {/* Main Transaction Info */}
            <div className="p-6 flex flex-col items-center justify-center border-b">
              {getTypeIcon(transaction.type)}
              <h1>
                {transaction.type === "Expense"
                  ? "-"
                  : transaction.type === "Income"
                    ? "+"
                    : ""}
                {formatCurrency(transaction.amount)}
              </h1>
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
            <div className="flex items-center  gap-3">
              <Icon.FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium break-words">
                  {transaction.description}
                </p>
              </div>
            </div>
            {transaction?.status !== "Paid" &&
              transaction?.category?.type === "Expense" && (
                <div className="flex flex-col gap-3">
                  <hr />
                  <div className="flex justify-end gap-3">
                    <Button size="sm" variant={"outline"} className="text-xs">
                      Edit
                    </Button>

                    <Button size="sm" className="text-xs">
                      Pay
                    </Button>
                  </div>
                  <hr />
                </div>
              )}

            {/* Transaction History */}
            {/* <DialogAccordion
              transaction={transaction}
              getTypeIcon={getTypeIcon}
            /> */}

            {/* Additional Details */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewTransaction;
