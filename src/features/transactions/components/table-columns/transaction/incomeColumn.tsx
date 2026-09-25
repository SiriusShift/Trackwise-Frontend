import {
  useDeleteIncomeMutation,
} from "@/features/transactions/api/transaction/incomeApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { categoryApi } from "@/shared/api/categoryApi";
import ViewTransaction from "@/shared/components/dialog/ViewDialog/ViewTransaction";
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
import { TransactionRow } from "@/shared/types";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { StatusIcon } from "../../StatusIcon";
import { accountsApi } from "@/shared/api/accountsApi";
export const incomeColumns: ColumnDef<TransactionRow>[] = [
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
  //   cell: ({ getValue }) => <span>{getValue<string>() || "-"}</span>,
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
  // {
  //   accessorKey: "remainingBalance",
  //   header: "Balance",
  //   // header: ({ column }) => {
  //   //   return (
  //   //     <Button
  //   //       variant={"ghost"}
  //   //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //   //     >
  //   //       Paid
  //   //       <ArrowUpDown />
  //   //     </Button>
  //   //   );
  //   // },
  //   cell: ({ getValue }) => {
  //     const amount = getValue() as number | undefined;
  //     return <span>₱{Number(amount).toFixed(2) || "0"}</span>;
  //   },
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{getValue<string>()}</Badge>
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
        <span className="truncate"> {getValue<string>() || "-"}</span>
      </div>
    ),

    meta: {
      cellClassName: "border-b",
    },
  },

  {
    accessorKey: "asset.name",
    header: "Destination",
    cell: ({ getValue }) => <span>{getValue<string>() || "-"}</span>,
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
      const status = getValue<string>();

      return (
        <Badge variant="outline" className="p-1 px-2">
          {StatusIcon[status as keyof typeof StatusIcon] || null}
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
      const [mode, setMode] = useState<"edit" | "transact">("edit");
      const [viewOpen, setViewOpen] = useState(false);
      console.log(open);
      const income = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(row);

      const [deleteIncome] = useDeleteIncomeMutation();

      const onView = () => {
        setDropdownOpen(false);
        setViewOpen(true);
      };

      const onArchive = async () => {
        confirm({
          description: `Are you sure you want to archive this income?`,
          title: `Archive income`,
          variant: "info",
          confirmText: "Confirm",
          showLoadingOnConfirm: true,
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteIncome({
                data: {
                  delete: true,
                },
                id: income.id,
              }).unwrap();
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
              dispatch(accountsApi.util.invalidateTags(["Assets"]));
            } catch (err) {
              console.log(err);
              toast.error(handleCatchErrorMessage(err));
            }
          },
        });
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
