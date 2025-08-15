import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CreditCard,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Expense } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { useDeleteExpenseMutation } from "@/features/transactions/api/transaction/expensesApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useState } from "react";
import { IRootState } from "@/app/store";

export const installmentColumn: ColumnDef<Expense>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    accessorKey: "months",
    header: "Installment Term",
    meta: {
      cellClassName: "border-b",
      headerClassName: "inline-block w-32 flex items-center",
    },
    cell: ({ getValue }) => {
      return <span>₱{getValue()}</span>;
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
    accessorKey: "totalAmount",
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
    id: "actions",
    meta: {
      headerClassName:
        "sticky right-0 bg-background z-10 border-l border-b w-12",
      cellClassName: "sticky right-0 bg-background z-10 border-l border-b w-12",
    },
    // header: "Actions",
    cell: ({ row }) => {
      const activeType = useSelector((state: IRootState) => state.active.type);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);
      console.log(open);
      const expense = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(row);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

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
              await deleteExpense(expense.id);
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
        await deleteExpense(expense.id);
        dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
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
              <DropdownMenuItem>
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
            rowData={expense}
            mode="edit"
          />
        </>
      );
    },
  },
];
