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
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useDeleteExpenseMutation } from "@/feature/expenses/api/expensesApi";
import { TransactionDialog } from "@/components/dialog/expenses/TransactionDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import PayDialog from "@/components/dialog/expenses/PayDialog";
import { assetsApi } from "@/feature/assets/api/assetsApi";
import { categoryApi } from "@/feature/category/api/categoryApi";
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
          {dateValue ? moment(dateValue).format("MMMM DD, YYYY h:mm a") : "-"}
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
      const dispatch = useDispatch();
      // console.log(expense);

      const activeTab = useSelector((state: any) => state.active.expenseTab);

      const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();

      const onDelete = async () => {
        await deleteExpense(expense.id);
        dispatch(categoryApi.util.invalidateTags(["CategoryLimit"]));
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
              <TransactionDialog rowData={expense} active={activeTab} mode="edit" />
              <DropdownMenuItem>
                <Eye />
                View
              </DropdownMenuItem>
              <DeleteDialog
                onDelete={onDelete}
                description="Are you sure you want to delete this expense? This action cannot be
            undone"
                title="Delete Expense"
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
              <PayDialog rowData={expense} />
              <TransactionDialog rowData={expense} active={activeTab} mode="edit" />
              <DropdownMenuItem>
                <Eye />
                View
              </DropdownMenuItem>
              <DeleteDialog
                onDelete={onDelete}
                description="Are you sure you want to delete this recurring expense? This action cannot be
            undone"
                title="Delete Recurring Expense"
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
