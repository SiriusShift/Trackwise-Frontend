import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingDown,
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
import noPie from "@/assets/images/noDataPie.svg";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  trend: any;
}

const chartConfig = {
  width: "100%", // Full width of the container
  height: 210, // Fixed height for the chart
  innerRadius: 55, // Inner radius for the pie chart
  outerRadius: 80, // Outer radius for the pie chart
  strokeWidth: 5, // Stroke width for the pie chart
  strokeColor: "hsl(var(--background))", // Stroke color (primary background color)
  dataKey: "total", // The key in the data for the value
  nameKey: "categoryName", // The key in the data for the label
  colors: [
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
  ],
  labelValueFontSize: 16, // Font size for the label value in the center
  labelValueFontWeight: "bold", // Font weight for the label value
  labelValueClassName: "text-destructive", // CSS class for the label value (color)
  showTooltip: true, // Whether or not to display the tooltip
};

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
  trend,
  setPageIndex,
  setPageSize,
  categoryExpenses,
}: DataTableProps<TData, TValue>) {
  console.log(data.length);
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
      <div className="flex gap-5">
        <div className="border relative w-full min-[400px] max-h-[400px] rounded-md z-0 overflow-auto">
          <Table>
            <TableHeader className="h-8 text-xs sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.columnDef.meta?.headerClassName || "" // Use headerClassName
                      }
                    >
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
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap ${
                          cell.column.columnDef.meta?.cellClassName || ""
                        }`}
                      >
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
        <Card className="flex flex-col min-w-[300px]">
          {/* Card Header */}
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-lg xl:text-xl text-center">
              {currentPageName?.name} - Pie Chart
            </CardTitle>
            <CardDescription className="text-center">
              {moment(date).format("MMMM YYYY")}
            </CardDescription>
          </CardHeader>

          {/* Card Content */}
          <ChartContainer config={chartConfig}>
            <CardContent className="flex-1 content-center pb-0">
              <ResponsiveContainer
                width={chartConfig.width}
                height={chartConfig.height}
              >
                {categoryExpenses?.length > 0 ? (
                  <PieChart>
                    {chartConfig.showTooltip && (
                      <ChartTooltip content={<ChartTooltipContent />} />
                    )}
                    <Pie
                      data={categoryExpenses}
                      dataKey={chartConfig.dataKey} // Using 'total' for the value
                      nameKey={chartConfig.nameKey} // Using 'categoryName' for the label
                      innerRadius={chartConfig.innerRadius}
                      outerRadius={chartConfig.outerRadius}
                      strokeWidth={chartConfig.strokeWidth}
                      stroke={chartConfig.strokeColor} // Apply primary color for the border
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartConfig.colors[
                              index % chartConfig.colors.length
                            ]
                          }
                        />
                      ))}
                      <Label
                        position="center"
                        fontSize={16}
                        fontWeight="bold"
                        // className="text-destructive"
                        value={`₱${total?.toLocaleString()}`}
                      />
                    </Pie>
                  </PieChart>
                ) : (
                  <div className="flex justify-center h-full items-center">
                    <img src={noPie} width={150} alt="No Data" />
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </ChartContainer>

          {/* Card Footer */}
          <CardFooter className="flex flex-col items-center text-center gap-2 text-sm">
            {/* Trending Section */}
            <div className="flex items-center justify-center gap-2 font-medium leading-none">
              {trend === "NaN" ? (
                <span>No data for trend calculation</span>
              ) : (
                <>
                  <span className="truncate">
                    Trending {trend > 0 ? "up" : "down"} this month by {trend}%
                  </span>
                  {trend > 0 ? (
                    <TrendingUp
                      className={`h-4 w-4 ${
                        currentPageName?.name === "Expenses"
                          ? "text-destructive"
                          : "text-success"
                      }`}
                    />
                  ) : (
                    <TrendingDown
                      className={`h-4 w-4 ${
                        currentPageName?.name === "Expenses"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    />
                  )}
                </>
              )}
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
