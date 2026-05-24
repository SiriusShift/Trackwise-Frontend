import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

import * as Icon from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

import { formatCurrency, formatDate } from "@/shared/utils/CustomFunctions";
import ViewImage from "./ViewImage";
import { Separator } from "../../ui/separator";
import { Card } from "../../ui/card";

const transactionTypeConfig = {
  expense: {
    text: "text-destructive",
    bg: "bg-destructive/15",
    iconColor: "text-destructive",
    icon: Icon.ArrowUp,
    prefix: "-",
  },

  income: {
    text: "text-success",
    bg: "bg-success/15",
    iconColor: "text-success",
    icon: Icon.ArrowDown,
    prefix: "+",
  },

  transfer: {
    text: "text-info",
    bg: "bg-info/15",
    iconColor: "text-info",
    icon: Icon.ArrowRightLeft,
    prefix: "",
  },

  default: {
    text: "text-foreground",
    bg: "bg-muted",
    iconColor: "text-muted-foreground",
    icon: Icon.DollarSign,
    prefix: "",
  },
};

const statusConfig = {
  completed: {
    color: "success",
    className: "bg-success/15 text-success border-success/20",
    icon: Icon.Check,
  },

  received: {
    color: "success",
    className: "bg-success/15 text-success border-success/20",
    icon: Icon.Check,
  },

  paid: {
    color: "success",
    className: "bg-success/15 text-success border-success/20",
    icon: Icon.Check,
  },

  pending: {
    color: "warning",
    className: "bg-warning/15 text-warning border-warning/20",
    icon: Icon.Clock3,
  },

  partial: {
    color: "warning",
    className: "bg-warning/15 text-warning border-warning/20",
    icon: Icon.AlertCircle,
  },

  overdue: {
    color: "destructive",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: Icon.AlertTriangle,
  },

  failed: {
    color: "destructive",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: Icon.XCircle,
  },
};

const InfoRow = ({ icon: IconComponent, label, value, onPreview }) => (
  <div
    className={`flex flex-1 items-start justify-between gap-3 ${
      label === "Image" && "flex-col"
    }`}
  >
    <div className="flex flex-row gap-1">
      <IconComponent className="mt-0.5 text-muted-foreground" size={15} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>

    {label === "Image" ? (
      value ? (
        <button
          type="button"
          onClick={() => onPreview(value)}
          className="group relative h-52 w-full overflow-hidden rounded-xl"
        >
          <img
            src={value}
            alt="Transaction attachment"
            className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">
              View Image
            </span>
          </div>
        </button>
      ) : (
        <Card className="text-sm text-muted-foreground w-full h-52 flex flex-col items-center justify-center">
          <Icon.ImageOff />
          <h1>No image</h1>
        </Card>
      )
    ) : (
      <p className="font-medium break-words text-sm">{value || "N/A"}</p>
    )}
  </div>
);

const ViewTransaction = ({ transaction, open, setOpen }) => {
  if (!transaction) return null;
  const [previewImage, setPreviewImage] = React.useState(false);
  const type =
    transactionTypeConfig[transaction?.type?.toLowerCase()] ||
    transactionTypeConfig.default;

  const status = statusConfig[transaction?.status?.toLowerCase()];

  const TypeIcon = type.icon;
  const StatusIcon = status?.icon;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg sm:max-h-[75%] overflow-y-auto p-0 flex flex-col"
        >
          {/* Header */}
          <DialogHeader className="border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                <Icon.ReceiptText className="h-5 w-5" />

                {transaction?.interval
                  ? "Recurring Transaction"
                  : "Transaction Details"}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-5">
            {/* Amount Section */}
            <div className="flex flex-col items-center justify-center gap-3 pb-6">
              <div className={`rounded-2xl p-4 ${type.bg}`}>
                <TypeIcon className={`h-6 w-6 ${type.iconColor}`} />
              </div>

              <div className="text-center">
                <h1 className={`text-3xl font-bold ${type.text}`}>
                  {type.prefix}
                  {formatCurrency(transaction.amount)}
                </h1>

                {status && (
                  <Badge
                    variant="outline"
                    className={`mt-3 gap-1.5 rounded-full px-3 py-1 ${status.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {transaction.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
              {/* <hr/>
            <InfoRow
              icon={Icon.Hash}
              label="Transaction ID"
              value={`#${transaction.id}`}
            /> */}

              <InfoRow
                icon={Icon.Calendar}
                label="Date"
                value={formatDate(transaction.date || transaction.startDate)}
              />

              <Separator />

              <InfoRow
                icon={Icon.Tag}
                label="Category"
                value={transaction.category?.name}
              />
              <Separator />

              <InfoRow
                icon={Icon.FileText}
                label="Description"
                value={transaction.description}
              />
              <Separator />
              
              <InfoRow
                icon={Icon.Wallet}
                label="Account"
                value={transaction.asset.name}
              />
              <Separator />

              <InfoRow
                icon={Icon.Image}
                label="Image"
                value={transaction.image}
                onPreview={setPreviewImage}
              />
            </div>

            {/* Actions */}
            {/* {transaction?.status !== "Paid" &&
            transaction?.category?.type === "Expense" && (
              <div className="flex justify-end gap-2 pt-5">
                <Button size="sm" variant="outline">
                  Edit
                </Button>

                <Button size="sm">Pay</Button>
              </div>
            )} */}
          </div>
        </DialogContent>
      </Dialog>
      <ViewImage
        image={transaction.image}
        open={previewImage}
        setOpen={setPreviewImage}
      />
    </>
  );
};

export default ViewTransaction;
