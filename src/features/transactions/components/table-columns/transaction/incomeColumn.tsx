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
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { categoryApi } from "@/shared/api/categoryApi";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Portal } from "@radix-ui/react-tooltip";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import {
  useDeleteIncomeMutation,
  usePostAutoReceiveMutation,
} from "@/features/transactions/api/transaction/incomeApi";
import { StatusIcon } from "../../statusIcon";
import ViewTransaction from "@/shared/components/dialog/ViewDialog/ViewTransaction";
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
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [mode, setMode] = useState<string>();
      const [viewOpen, setViewOpen] = useState(false);
      console.log(open);
      const income = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(row);

      const [deleteIncome] = useDeleteIncomeMutation();
      const [receiveAuto] = usePostAutoReceiveMutation();

      const onView = () => {
        setDropdownOpen(false);
        setViewOpen(true);
      };

      const onPayment = async () => {
        if (income?.recurringTemplate?.auto) {
          confirm({
            title: "Confirm Payment",
            description: "Do you want to proceed with paying this expense?",
            variant: "info",
            confirmText: "Pay",
            cancelText: "Cancel",
            showLoadingOnConfirm: true,
            onConfirm: async () => {
              try {
                await receiveAuto({
                  id: income.id,
                  data: {
                    type: "Income",
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

      const onArchive = () => {};
      const onCancel = async () => {};

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
                      disabled={income?.status === "Paid"}
                    >
                      <Banknote /> Receive
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <Portal>
                  {income?.status === "Paid" && (
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
                        income?.status === "Paid" ||
                        income?.status === "Partial"
                      }
                    >
                      <Pencil /> Edit
                    </DropdownMenuItem>
                  </span>
                </TooltipTrigger>
                <Portal>
                  <>
                    {income?.status === "Partial" && (
                      <TooltipContent side="right" sideOffset={10}>
                        Editing disabled — this income is partially paid.
                        Changing the amount could cause balance conflicts.
                      </TooltipContent>
                    )}
                    {income?.status === "Paid" && (
                      <TooltipContent side="right" sideOffset={10}>
                        Editing disabled — this income is already paid.
                      </TooltipContent>
                    )}
                  </>
                </Portal>
              </Tooltip>

              {/* --- View --- */}
              <DropdownMenuItem onClick={onView}>
                <Eye /> View
              </DropdownMenuItem>

              {/* --- Cancel Recurring --- */}
              {income?.recurringTemplate && (
                <DropdownMenuItem onClick={oncancel}>
                  <X /> Cancel
                </DropdownMenuItem>
              )}

              {/* --- Archive --- */}
              <DropdownMenuItem onClick={onArchive}>
                <Archive /> Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TransactionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            rowData={income}
            mode={mode}
          />
          <ViewTransaction
            open={viewOpen}
            setOpen={setViewOpen}
            transaction={income}
          />
        </>
      );
    },
  },
];
