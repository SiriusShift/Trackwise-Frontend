import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const dateValue = getValue();
      return <span>{dateValue ? moment(dateValue).format("MMMM DD, YYYY") : "-"}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{getValue()}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue() as number | undefined;
      return <span>${amount?.toFixed(2) || "0.00"}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Source",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
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
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                payment?.id
                  ? navigator.clipboard.writeText(String(payment.id))
                  : console.warn("No payment ID available.")
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];



export const recurringExpenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const dateValue = getValue();
      return <span>{dateValue ? moment(dateValue).format("MMMM DD, YYYY") : "-"}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{getValue()}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue() as number | undefined;
      return <span>${amount?.toFixed(2) || "0.00"}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Source",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
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

      return <Badge variant={"outline"} ><div className={`h-2 w-2 rounded-full mr-2 bg-${statusColor}`}/>{status || "unknown"}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                payment?.id
                  ? navigator.clipboard.writeText(String(payment.id))
                  : console.warn("No payment ID available.")
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
