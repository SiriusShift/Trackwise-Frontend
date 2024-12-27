import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownFromLine,
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import NoData from "@/assets/images/noData.svg";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { navigationData } from "@/navigation/navigationData";
import moment from "moment";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Columns definition
  data: TData[]; // Data to display
  pageSize: number; // Number of rows per page
  pageIndex: number; // Current page index
  totalPages: number; // Total number of pages
  totalCount: number; // Total number of items
  date: Date; // Date filter
  setPageIndex: React.Dispatch<React.SetStateAction<number>>; // Page index setter
  setPageSize: React.Dispatch<React.SetStateAction<number>>; // Page size setter
  categoryExpenses: any;
  total: number;
}

const getColor = (index) => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))",
  ];
  return colors[index % colors.length];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  date,
  pageIndex,
  totalPages,
  total,
  setPageIndex,
  setPageSize,
  categoryExpenses,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const location = useLocation();
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    // Remove pagination handling from here
  });

  return (
    <div className="min-w-full space-y-5">
      {/* Filter */}
      <div className="flex items-center flex-row gap-2 sm:gap-5 min-w-full justify-between">
        {/* Filter Input */}
        {/* <Input placeholder="Filter description..." value={...} /> */}
      </div>

      {/* Table container with responsive and overflow behavior */}
      <div className="flex gap-5 ">
        <div className="border relative w-full h-[375px] rounded-md z-0 overflow-auto">
          <Table>
            <TableHeader className="h-8 text-xs sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="font-semibold ">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    <img
                      src={NoData}
                      className="mx-auto"
                      width={350}
                      alt="No Data"
                    />
                    <p>No data found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Card className="flex flex-col max-w-[400px]">
          {/* Card Header */}
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-lg xl:text-xl text-center">
              Expenses - Pie Chart
            </CardTitle>
            <CardDescription className="text-center">
              {moment(date).format("MMMM YYYY")}
            </CardDescription>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="flex-1 content-center pb-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                {/* Pie Chart */}
                <Pie
                  data={categoryExpenses}
                  dataKey="total" // Using 'total' for the value
                  nameKey="categoryName" // Using 'categoryName' for the label
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                  stroke="hsl(var(--background))" // Apply primary color for the border
                >
                  {categoryExpenses?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(index)} />
                  ))}
                  <Label
                    position="center"
                    fontSize={16}
                    fontWeight="bold"
                    className="text-destructive"
                    value={`₱${total?.toLocaleString()}`}
                    // content={({ viewBox }) => {
                    //   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    //     return (
                    //       <text
                    //         x={viewBox.cx}
                    //         y={viewBox.cy}
                    //         textAnchor="middle"
                    //         dominantBaseline="middle"
                    //       >
                    //         <tspan
                    //           x={viewBox.cx}
                    //           y={viewBox.cy}
                    //           className="fill-foreground text-3xl font-bold"
                    //         >
                    //           {total.toLocaleString()}
                    //         </tspan>
                    //         <tspan
                    //           x={viewBox.cx}
                    //           y={(viewBox.cy || 0) + 24}
                    //           className="fill-muted-foreground"
                    //         >
                    //           Visitors
                    //         </tspan>
                    //       </text>
                    //     );
                    //   }
                    // }}
                  />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="flex flex-col items-center text-center gap-2 text-sm">
            {/* Trending Section */}
            <div className="flex items-center justify-center gap-2 font-medium leading-none">
              <span className="truncate">Trending up this month by 5.2%</span>
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
            </div>
            {/* Description Section */}
            <div className="leading-none text-muted-foreground">
              Showing total {currentPageName?.name.toLocaleLowerCase()} for the
              month of {moment(date).format("MMMM")}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Pagination Footer */}
      <div className="flex w-full py-1 gap-2 overflow-x-auto justify-between sm:justify-end whitespace-nowrap">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden sm:inline">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value)); // Update page size
              setPageIndex(0); // Reset to first page when page size changes
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Information */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <span className="hidden sm:inline">Page</span> {pageIndex + 1} of{" "}
          {totalPages}
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)} // Go to first page
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))} // Go to previous page
            disabled={pageIndex === 0}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
            } // Go to next page
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(totalPages - 1)} // Go to last page
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
