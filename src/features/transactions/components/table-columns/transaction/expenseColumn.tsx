import {
  expensesApi,
  useCancelRecurringExpenseMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Expense } from "@/shared/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowUpDown,
  Banknote,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  X,
} from "lucide-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
// import PayDialog from "@/features/transactions/components/dialogs/PayDialog";
import { useArchiveTransactionMutation } from "@/features/transactions/api/transaction";
import { StatusIcon } from "@/features/transactions/components/StatusIcon";
import { assetsApi } from "@/shared/api/assetsApi";
import { categoryApi } from "@/shared/api/categoryApi";
import ViewTransaction from "@/shared/components/dialog/ViewDialog/ViewTransaction";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { Portal } from "@radix-ui/react-tooltip";
import { useState } from "react";
import ConfirmDialog from "../../dialogs/ConfirmDialog";

export const expenseColumns: ColumnDef<Expense>[] = [
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
      console.log(amount);
      return <span>₱{Number(amount).toFixed(2) || "0"}</span>;
    },
    meta: {
      cellClassName: "border-b",
    },
  },
  {
    accessorKey: "remainingBalance",
    header: "Balance",
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
    cell: ({ getValue, row }) => (
      <div className="flex items-center w-40 gap-2">
        {row.original?.recurringTemplate && (
          <span title="Recurring expense">
            <RefreshCcw
              className={`${row.original.recurringTemplate?.isActive ? "text-blue-500" : "text-red-500"}`}
              size={15}
            />
          </span>
        )}
        <span className="truncate"> {getValue() || "-"}</span>
      </div>
    ),

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
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      cellClassName: "border-b",
    },
    cell: ({ getValue }) => {
      const status = getValue() as Expense["status"];

      return (
        <Badge variant="outline" className="p-1 px-2">
          {StatusIcon[status] || null}
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
      // const activeType = useSelector((state: any) => state.active.type);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [confirmOpen, setConfirmOpen] = useState(false);
      const [mode, setMode] = useState<string>();
      const [viewOpen, setViewOpen] = useState(false);
      console.log(open);
      const expense = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(expense);

      const [deleteExpense] = useArchiveTransactionMutation();
      const [cancelRecurring] = useCancelRecurringExpenseMutation();

      const onArchive = async () => {
        confirm({
          description: `Are you sure you want to archive this expense?`,
          title: `Archive expense`,
          variant: "info",
          confirmText: "Confirm",
          showLoadingOnConfirm: true,
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteExpense({
                data: {
                  type: "expense",
                },
                id: expense.id,
              }).unwrap();
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              dispatch(expensesApi.util.invalidateTags(["Expenses"]));
              dispatch(assetsApi.util.invalidateTags(["Assets"]));
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
      };

      const onStopSeries = async () => {
        console.log(expense);
        confirm({
          description: `Are you sure you want to cancel this recurring expense?`,
          title: `Cancel recurring expense`,
          variant: "info",
          confirmText: "Confirm",
          showLoadingOnConfirm: true,
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await cancelRecurring(expense?.recurringTemplate?.id).unwrap();
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

              {/* --- Pay --- */}
              {expense.recurringTemplate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <DropdownMenuItem
                        onSelect={() => setConfirmOpen(true)}
                        // disabled={expense?.status === "Completed"}
                      >
                        <Banknote /> Confirm
                      </DropdownMenuItem>
                    </span>
                  </TooltipTrigger>
                  <Portal>
                    {expense?.status === "Completed" && (
                      <TooltipContent side="right" sideOffset={10}>
                        Already paid
                      </TooltipContent>
                    )}
                  </Portal>
                </Tooltip>
              )}

              {/* --- Edit --- */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMode("edit");
                  setDialogOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <Pencil /> Edit
              </DropdownMenuItem>

              {/* --- View --- */}
              <DropdownMenuItem onClick={onView}>
                <Eye /> View
              </DropdownMenuItem>
              {/* --- Archive --- */}
              <DropdownMenuItem onClick={onArchive}>
                <Archive /> Archive
              </DropdownMenuItem>
              {/* -------- Recurring Section -------- */}
              {expense?.recurringTemplate && (
                <>
                  <DropdownMenuSeparator />

                  {/* Stop whole series */}
                  <DropdownMenuItem
                    disabled={!expense?.recurringTemplate?.isActive}
                    onClick={onStopSeries}
                  >
                    <X className="h-4 w-4 text-destructive" />
                    Stop Recurring
                  </DropdownMenuItem>
                </>
              )}

              {/* --- Payment History --- */}
              {/* {expense?.recurringId && (
                <DropdownMenuItem onClick={onHistory}>
                  <History /> Payment History
                </DropdownMenuItem>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialogs */}
          <TransactionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            rowData={expense}
            mode={mode}
          />

          <ViewTransaction
            open={viewOpen}
            setOpen={setViewOpen}
            transaction={expense}
          />

          <ConfirmDialog
            open={confirmOpen}
            setOpen={setConfirmOpen}
            data={expense}
          />
        </>
      );
    },
  },
];
