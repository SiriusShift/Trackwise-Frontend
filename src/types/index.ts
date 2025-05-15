export interface Expense {
  id: number; // Unique identifier
  date: string; // Date of the expense
  category: string; // Category of the expense (e.g., "Food & Dining", "Transport")
  description?: string; // Optional description
  amount: number; // Expense amount
  source: Object;
  status: "Paid" | "Unpaid" | "Pending"; // Status of the expense
}

export interface Income {
  id: number;
  date: Date;
  category: string;
  description?: string;
  amount: number;
  source?: { id: number; name: string };
  user: { id: number; name: string };
  status: "Received" | "Pending" | string;
}

export interface CommonToolbarProps {
  type: string;
  children: React.ReactNode;
  active: string;
  title: string;
}

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

export interface expenseForm {
  name: string;
  email: string;
  password: string;
}

export interface trackerFormType {
  category: Object;
  amount: number;
}

export interface payRecurringForm {
  amount: number;
  source: object;
}

export interface commonWidgetProps {
  children: React.ReactNode;
  title: string;
}

export interface overviewWidgetProps {
  startDate: Date;
  endDate: Date;
}

export interface commonTrackerProps {
  title: string;
  data: Object[];
  isLoading: boolean;
  type: string;
  onSubmit: () => void;
  onDelete: () => void;
  addDescription: string;
  editDescription: string;
}