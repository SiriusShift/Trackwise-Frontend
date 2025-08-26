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
  Trash2,
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
import { useDeleteExpenseMutation } from "@/features/transactions/api/transaction/expensesApi";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// import PayDialog from "@/features/transactions/components/dialogs/PayDialog";
import { assetsApi } from "@/shared/api/assetsApi";
import { categoryApi } from "@/shared/api/categoryApi";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { useState } from "react";
import ViewImage from "@/shared/components/dialog/ViewImage";
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

      const iconMap = {
        Paid: <CheckCircle className="text-green-500 mr-2" size={16} />,
        Pending: (
          <Loader className="text-yellow-500 mr-2" size={16} />
        ),
        Overdue: <CircleAlert className="text-red-500 mr-2" size={16} />,
        Partial: <Clock className="text-red-500 mr-2" size={16} />,
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
      const expense = row.original;
      const { confirm } = useConfirm();
      const dispatch = useDispatch();
      console.log(expense);

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
              await deleteExpense({data: {
                delete: true
              } , id:expense.id});
              dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
            } catch (err) {
              console.log(err);
              toast.error(err?.data?.error);
            }
          },
        });
      };

      const onView = () => {
        setDropdownOpen(false)
        setViewOpen(true)
      }

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
              {expense?.status !== "Paid" && (
                <DropdownMenuItem>
                  <Banknote /> Pay
                </DropdownMenuItem>
              )}
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
            rowData={expense}
            mode="edit"
          />
          <ViewImage open={viewOpen} setOpen={setViewOpen} image={expense?.image}/>
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
          {dateValue ? moment(dateValue).format("MMMM DD, YYYY h:mm a") : "-"}
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
  // {
  //   accessorKey: "balance",
  //   header: "Balance",
  //   cell: ({ getValue }) => {
  //     const amount = getValue() as number | undefined;
  //     return <span>₱{amount?.toFixed(2) || "0"}</span>;
  //   },
  //   meta: {
  //     cellClassName: "border-b",
  //   },
  // },
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
      const dispatch = useDispatch();
      // const [isDropdownOpen, setDropdownOpen] = useState(false);
      const activeTab = useSelector((state: any) => state.active.expenseTab);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(expense.id).then(() => {
          dispatch(assetsApi.util.invalidateTags(["Assets"]));
        });
        toast.success("Expense deleted successfully");
      };

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <PayDialog rowData={expense} /> */}
              <TransactionDialog
                rowData={expense}
                active={activeTab}
                mode="edit"
              />
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

          {/* <DeleteDialog open={isExpenseOpen} onOpenChange={(open) => setIsExpenseOpen(open)} /> */}
        </>
      );
    },
  },
];
