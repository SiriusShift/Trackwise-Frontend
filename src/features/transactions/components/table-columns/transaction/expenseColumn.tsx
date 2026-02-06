import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Banknote,
  CheckCircle,
  CircleAlert,
  Clock,
  CreditCard,
  Eye,
  Loader,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  History,
  Trash2,
  X,
  Archive,
} from "lucide-react";
import { Expense } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import moment from "moment";
import { Badge } from "@/shared/components/ui/badge";
import {
  useCancelRecurringExpenseMutation,
  useDeleteExpenseMutation,
  usePostAutoPaymentMutation,
} from "@/features/transactions/api/transaction/expensesApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// import PayDialog from "@/features/transactions/components/dialogs/PayDialog";
import { assetsApi } from "@/shared/api/assetsApi";
import { categoryApi } from "@/shared/api/categoryApi";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useState } from "react";
import ViewImage from "@/shared/components/dialog/ViewDialog/ViewImage";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Portal } from "@radix-ui/react-tooltip";
import ViewTransaction from "@/shared/components/dialog/ViewDialog/ViewTransaction";
import { StatusIcon } from "@/features/transactions/components/statusIcon";
import { setOpenDialog } from "@/shared/slices/activeSlice";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
// import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export const expenseColumns: ColumnDef<Expense>[] = [
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
          {dateValue ? moment(dateValue).format("MMM DD, YYYY") : "-"}
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
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant={"ghost"}
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Paid
    //       <ArrowUpDown />
    //     </Button>
    //   );
    // },
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
      <div className="flex items-center gap-2">
        {row.original?.recurringTemplate && (
          <span title="Recurring expense">
            <RefreshCcw className="text-blue-500" size={15} />
          </span>
        )}
        <span> {getValue() || "-"}</span>
      </div>
    ),

    meta: {
      cellClassName: "border-b",
    },
  },

  // {
  //   accessorKey: "asset.name",
  //   header: "Source",
  //   cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
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
      const [mode, setMode] = useState<string>();
      const [viewOpen, setViewOpen] = useState(false);
      console.log(open);
      const expense = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(expense);

      const [deleteExpense] = useDeleteExpenseMutation();
      const [payAuto] = usePostAutoPaymentMutation();
      const [cancelRecurring] = useCancelRecurringExpenseMutation();

      const onArchive = async () => {
        confirm({
          description: `Are you sure you want to archive this expense?`,
          title: `Archive expense`,
          variant: "info",
          confirmText: "Delete",
          showLoadingOnConfirm: true,
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteExpense({
                data: {
                  delete: true,
                },
                id: expense.id,
              }).unwrap();
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              dispatch(assetsApi.util.invalidateTags(["Assets"]));
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
      };

      const onStopSeries = async () => {
        console.log(expense)
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

      const onPayment = async () => {
        console.log(expense?.recurringTemplate, "expense payment");
        if (expense?.recurringTemplate?.auto) {
          confirm({
            title: "Confirm Payment",
            description: "Do you want to proceed with paying this expense?",
            variant: "info",
            confirmText: "Pay",
            cancelText: "Cancel",
            showLoadingOnConfirm: true,
            onConfirm: async () => {
              try {
                await payAuto({
                  id: expense.id,
                  data: {
                    type: "Expense",
                  },
                }).unwrap();
                dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              } catch (err) {
                let errorMessage = handleCatchErrorMessage(err); // Default message
                toast.error(errorMessage);
              }
            },
          });
        } else {
          setMode("transact");
          setDialogOpen(true); // open dialog
          setDropdownOpen(false); // close dropdown manually
        }
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem
                      onSelect={onPayment}
                      disabled={expense?.status === "Paid"}
                    >
                      <Banknote /> Pay
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <Portal>
                  {expense?.status === "Paid" && (
                    <TooltipContent side="right" sideOffset={10}>
                      Already paid
                    </TooltipContent>
                  )}
                </Portal>
              </Tooltip>

              {/* --- Edit --- */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMode("edit");
                        setDialogOpen(true);
                        setDropdownOpen(false);
                      }}
                      disabled={
                        expense?.status === "Paid" ||
                        expense?.status === "Partial"
                      }
                    >
                      <Pencil /> Edit
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <Portal>
                  <>
                    {expense?.status === "Partial" && (
                      <TooltipContent side="right" sideOffset={10}>
                        Editing disabled — partially paid.
                      </TooltipContent>
                    )}
                    {expense?.status === "Paid" && (
                      <TooltipContent side="right" sideOffset={10}>
                        Editing disabled — already paid.
                      </TooltipContent>
                    )}
                  </>
                </Portal>
              </Tooltip>

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
                  <DropdownMenuItem onClick={onStopSeries}>
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
        </>
      );
    },
  },
];

export const recurringExpenseColumns: ColumnDef<any>[] = [
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
      return <span>₱{Number(amount)?.toFixed(2) || "0"}</span>;
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
  // {
  //   accessorKey: "isActive",
  //   header: "Active",
  //   cell: ({ getValue }) => {
  //     const active = getValue() as boolean;
  //     return (
  //       <Badge variant={active ? "success" : "destructive"}>
  //         {active ? "Active" : "Inactive"}
  //       </Badge>
  //     );
  //   },
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },

  // {
  //   accessorKey: "isVariable",
  //   header: "Mode",
  //   cell: ({ getValue }) => {
  //     const isVar = getValue() as boolean;
  //     return <Badge variant="outline">{isVar ? "Variable" : "Static"}</Badge>;
  //   },
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    accessorKey: "auto",
    header: "Auto",
    cell: ({ getValue }) => {
      const auto = getValue() as boolean;
      return (
        <RefreshCcw
          className={`mr-2 ${auto ? "text-success" : "text-muted-foreground"}`}
          size={15}
        />
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
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [viewOpen, setViewOpen] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const recurring = row.original;
      const dispatch = useDispatch();
      // const activeTab = useSelector((state: any) => state.active.expenseTab);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(recurring.id).then(() => {
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
        });
        toast.success("Recurring entry deleted successfully");
      };

      const onCancel = async () => {};

      const onArchive = () => {};

      const onView = () => {
        setDropdownOpen(false);
        setViewOpen(true);
      };

      return (
        <>
          <DropdownMenu
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4" /> View
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialogOpen(true); // open dialog
                  setDropdownOpen(false); // close dropdown manually
                }}
              >
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onCancel}>
                <X className="h-4 w-4" /> Cancel
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4" /> Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TransactionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            rowData={recurring}
            mode={"edit"}
          />
          <ViewTransaction
            open={viewOpen}
            setOpen={setViewOpen}
            transaction={recurring}
          />
        </>
      );
    },
  },
];
