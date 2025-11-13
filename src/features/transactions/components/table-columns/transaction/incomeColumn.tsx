import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Expense, Income } from "@/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  CircleAlert,
  CircleX,
  Clock,
  Eye,
  Loader,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransactionDialog } from "../../dialogs/TransactionDialog";
import ViewImage from "@/shared/components/dialog/ViewDialog/ViewImage";
import { useDeleteIncomeMutation } from "@/features/transactions/api/transaction/incomeApi";
import { categoryApi } from "@/shared/api/categoryApi";
import { toast } from "sonner";
import ViewDetailed from "@/shared/components/dialog/ViewDialog/ViewTransaction";

export const incomeColumns: ColumnDef<Income>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    accessorKey: "date",
    header: "Date and Time",
    meta: {
      cellClassName: "border-b",
      headerClassName: "inline-block w-32 flex items-center",
    },
    cell: ({ getValue }) => {
      const dateValue = getValue();
      return (
        <span>
          {dateValue ? moment(dateValue).format("MMM DD, h:mm a") : "-"}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "recipient",
  //   header: "Recipient",
  //   cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const amount = getValue() as number | undefined;
      return <span>₱{Number(amount).toFixed(2) || "0"}</span>;
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
    accessorKey: "asset.name",
    header: "Destination",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      cellClassName: "border-b",
    },
    cell: ({ getValue }) => {
      const status = getValue() as Expense["status"];

      const iconMap = {
        Received: <CheckCircle className="text-green-500 mr-2" size={16} />,
        Pending: <Loader className="text-yellow-500 mr-2" size={16} />,
        Overdue: <CircleAlert className="text-red-500 mr-2" size={16} />,
        Partial: <Clock className="text-yellow-500 mr-2" size={16} />,
      };

      return (
        <Badge variant="outline" className="p-1 px-2">
          {iconMap[status] || null}
          {status || "Unknown"}
        </Badge>
      );
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
      const activeType = useSelector((state: any) => state.active.type);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [viewOpen, setViewOpen] = useState(false);
      console.log(open);
      const income = row.original;
      const { confirm } = useConfirm();
      // const dispatch = useDispatch();
      console.log(row);

      const [deleteIncome, { isLoading }] = useDeleteIncomeMutation();

      const onDelete = async () => {
        confirm({
          description: `Are you sure you want to delete this ${activeType}?`,
          title: `Delete ${activeType}`,
          variant: "info",
          confirmText: "Delete",
          showLoadingOnConfirm: true,
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteIncome({
                data: {
                  delete: true,
                },
                id: income.id,
              });
              // dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
      };

      const onView = () => {
        setDropdownOpen(false);
        setViewOpen(true);
      };

      return (
        <>
          <DropdownMenu
            modal={false}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialogOpen(true); // open dialog
                  setDropdownOpen(false); // close dropdown manually
                }}
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              {/* <TransactionDialog
                type={activeType}
                rowData={expense}
                mode="edit"
                setDropdownOpen={setOpen}
              /> */}
              <DropdownMenuItem onClick={onView}>
                <Eye />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TransactionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            type={activeType}
            rowData={income}
            mode="edit"
          />
          <ViewDetailed
            open={viewOpen}
            setOpen={setViewOpen}
            transaction={income}
          />
        </>
      );
    },
  },
];
export const recurringIncomeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "nextDueDate",
    header: "Next Due",
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
      <Badge variant="outline">{getValue() || "-"}</Badge>
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
    accessorFn: (row) =>
      `${row.interval} ${row.unit}${row.interval > 1 ? "s" : ""}`,
    id: "repeat",
    header: "Repeat Every",
    cell: ({ getValue }) => <span>{getValue()}</span>,
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => {
      const active = getValue() as boolean;
      return (
        <Badge variant={active ? "success" : "destructive"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "auto",
    header: "Auto",
    cell: ({ getValue }) => {
      const auto = getValue() as boolean;
      return <Badge variant="outline">{auto ? "Yes" : "No"}</Badge>;
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  // {
  //   accessorKey: "isVariable",
  //   header: "Variable Amount",
  //   cell: ({ getValue }) => {
  //     const isVar = getValue() as boolean;
  //     return (
  //       <Badge variant="outline">{isVar ? "Yes" : "No"}</Badge>
  //     );
  //   },
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    id: "actions",
    meta: {
      headerClassName:
        "sticky right-0 bg-background z-10 border-l border-b w-12",
      cellClassName: "sticky right-0 bg-background z-10 border-l border-b w-12",
    },
    cell: ({ row }) => {
      const recurring = row.original;
      const dispatch = useDispatch();
      const activeTab = useSelector((state: any) => state.active.expenseTab);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(recurring.id).then(() => {
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
        });
        toast.success("Recurring entry deleted successfully");
      };

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
