import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CreditCard,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Expense } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useDeleteExpenseMutation } from "@/feature/expenses/api/expensesApi";
import { AddDialog } from "@/components/dialog/ExpenseDialog";
import { useSelector } from "react-redux";
// import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    meta: {
      cellClassName: "border-b",
    },
    cell: ({ getValue }) => {
      const dateValue = getValue();
      return (
        <span>
          {dateValue ? moment(dateValue).format("MMMM DD, YYYY") : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{getValue()}</Badge>
      </div>
    ),
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue() as number | undefined;
      return <span>₱{amount?.toFixed(2) || "0"}</span>;
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "asset.name",
    header: "Source",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ getValue }) => {
  //     const status = getValue() as Expense["status"];
  //     const statusColor =
  //       status === "Paid"
  //         ? "success"
  //         : status === "Unpaid"
  //         ? "warning"
  //         : "destructive";

  //     return <Badge variant={"outline"} ><div className={`h-2 w-2 rounded-full mr-2 bg-${statusColor}`}/>{status || "unknown"}</Badge>;
  //   },
  // },
  {
    id: "actions",
    meta: {
      headerClassName:
        "sticky right-0 bg-background z-10 border-l border-b w-12",
      cellClassName: "sticky right-0 bg-background z-10 border-l border-b w-12",
    },
    // header: "Actions",
    cell: ({ row }) => {
      const expense = row.original;
      // console.log(expense);
      const activeTab = useSelector((state: any) => state.activeTab.expenseTab);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(expense.id);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <AddDialog rowData={expense} active={activeTab} mode="edit" type="Expense" />
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>
                <Eye />
                View
              </DropdownMenuItem>
              <DeleteDialog
                type="All"
                onDelete={onDelete}
                isLoading={isLoading}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <DeleteDialog open={isExpenseOpen} onOpenChange={(open) => setIsExpenseOpen(open)} /> */}
        </>
      );
    },
  },
];

export const recurringExpenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: "Due date",
    cell: ({ getValue }) => {
      const dateValue = getValue();
      return (
        <span>
          {dateValue ? moment(dateValue).format("MMMM DD, YYYY") : "-"}
        </span>
      );
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{getValue()}</Badge>
      </div>
    ),
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue() as number | undefined;
      return <span>₱{amount?.toFixed(2) || "0"}</span>;
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as Expense["status"];
      const statusColor =
        status === "Paid"
          ? "success"
          : status === "Unpaid"
          ? "warning"
          : "destructive";

      return (
        <Badge variant={"outline"}>
          <div className={`h-2 w-2 rounded-full mr-2 bg-${statusColor}`} />
          {status || "unknown"}
        </Badge>
      );
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    id: "actions",
    meta: {
      headerClassName:
        "sticky right-0 bg-background z-10 border-l border-b w-12",
      cellClassName: "sticky right-0 bg-background z-10 border-l border-b w-12",
    },
    // header: "Actions",
    cell: ({ row }) => {
      const expense = row.original;
      const activeTab = useSelector((state: any) => state.activeTab.expenseTab);

      console.log(expense);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(expense.id);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <CreditCard />
                Pay
              </DropdownMenuItem>
              <AddDialog rowData={expense} active={activeTab} mode="edit" type="Recurring" />
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>
                <Eye />
                View
              </DropdownMenuItem>
              <DeleteDialog
                type="Recurring"
                onDelete={onDelete}
                isLoading={isLoading}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <DeleteDialog open={isExpenseOpen} onOpenChange={(open) => setIsExpenseOpen(open)} /> */}
        </>
      );
    },
  },
];
