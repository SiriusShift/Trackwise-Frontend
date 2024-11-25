export type Expense = {
  id: number; // Unique identifier
  date: string; // ISO format date string
  category: string; // Expense category
  description: string; // Description of the expense
  amount: number; // Amount in dollars
  paymentMethod: string; // Payment method used
  status: "Paid" | "Unpaid" | "Overdue"; // Specific status
};

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}
