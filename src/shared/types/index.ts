export interface Expense {
  id: number; // Unique identifier
  date: string; // Date of the expense
  category: string; // Category of the expense (e.g., "Food & Dining", "Transport")
  description?: string; // Optional description
  amount: number; // Expense amount
  source: Object;
  status: "Paid" | "Partial" | "Pending" | "Overdue"; // Status of the expense
  image: string;
  recurringId: number;
  recurringTemplate: RecurringTemplate;
}

export interface RecurringTemplate {
  amount: string;
  auto: boolean;
  endDate: string;
  fromAsset: Object;
  id: number;
  interval: number;
  isActive: true;
  type: string;
  unit: string;
}

export interface Field {
  onChange: (value: any) => void;
  onBlur: () => void;
  value: Date | string; // depends on your schema
  ref: React.Ref<any>;
  name: String;
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
  onSubmit: (data: any) => void;
  onDelete: (data: any) => void;
  addDescription: string;
  editDescription: string;
}

export interface frequencyProps {
  id: number;
  name: string;
  interval: number | null;
  unit: string | null;
}
