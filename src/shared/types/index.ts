import * as LucideIcon from "lucide-react";
export interface Expense {
  id: number; // Unique identifier
  date: string; // Date of the expense
  category: string; // Category of the expense (e.g., "Food & Dining", "Transport")
  description?: string; // Optional description
  amount: number; // Expense amount
  source: Object;
  status: "Completed" | "Pending" | "Overdue"; // Status of the expense
  image: string;
  recurringId: number;
  recurringTemplate: RecurringTemplate;
}

export interface Transfer {
  id: number; // Unique identifier
  date: string; // Date of the expense
  category: string; // Category of the expense (e.g., "Food & Dining", "Transport")
  description?: string; // Optional description
  amount: number; // Expense amount
  source: Object;
  status: "Completed" | "Pending" | "Overdue"; // Status of the expense
  image: string;
  recurringId: number;
  recurringTemplate: RecurringTemplate;
}

export interface Category {
  id: number;
  name: string;
  type: "Expense" | "Income" | "Transfer";
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  hasTracker: boolean;
}

export interface AssetTemplate {
  balance: number;
  data: AssetData[];
  message: string;
  success: true;
  trend: number;
}

export interface AssetData {
  id: number;
  name: string;
  remainingBalance: number;
  totalExpenses: number;
  totalIncomes: number;
  totalTransferIn: number;
  totalTransferOut: number;
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
  id?: number;
  category: Pick<CategoryType, "id" | "name"> | null;
  amount: number;
  period: string;
}

export interface CategoryLimit {
  id: number;
  value: number;
  total: number | string;
  period?: string;
  category: Pick<CategoryType, "id" | "name" | "icon" | "color">;
}

export interface payRecurringForm {
  amount: number;
  date: string;
  source: object;
  account: AssetData;
}

interface NamedRef {
  id?: number;
  name: string;
}

// A transaction (or recurring template) row as returned by the transaction list endpoints.
export interface TransactionRow {
  id: number;
  type?: string;
  amount: number;
  date?: string;
  description?: string;
  status?: string;
  image?: string | null;
  remainingBalance?: number;
  category?: {
    id?: number;
    name: string;
    type?: string;
    icon?: string;
    color?: string;
  };
  asset?: NamedRef | null;
  fromAsset?: NamedRef | null;
  toAsset?: NamedRef | null;
  recurringId?: number | null;
  recurringTemplate?: {
    id: number;
    auto?: boolean;
    isActive?: boolean;
  } | null;
}

// A single payment/occurrence belonging to a transaction or recurring template
export interface TransactionHistoryEntry {
  id: number;
  transactionType?: string;
  amount: number;
  date: string;
  description?: string;
  image?: string | null;
  status?: string;
  fromAsset?: NamedRef | null;
  toAsset?: NamedRef | null;
}

// Extra fields present when a transaction is opened for viewing
export interface TransactionDetails extends Omit<TransactionRow, "recurringTemplate"> {
  interval?: number;
  unit?: string;
  startDate?: string;
  recurringTemplate?: {
    id: number;
    auto?: boolean;
    isActive?: boolean;
    unit?: string;
    interval?: number;
    endDate?: string | null;
    fromAsset?: NamedRef | null;
  } | null;
  transactionHistory?: TransactionHistoryEntry[];
  generatedExpenses?: TransactionHistoryEntry[];
  generatedIncomes?: TransactionHistoryEntry[];
  generatedTransfers?: TransactionHistoryEntry[];
}

export type ScheduleType = "Expense" | "Income" | "Transfer";

// A recurring transaction template from /transactions/recurring
export interface Schedule {
  id: number;
  type: ScheduleType;
  description: string;
  amount: number | string;
  category: { icon?: string; name: string };
  fromAsset?: { name: string };
  behaviour?: string;
  unit?: string;
  interval?: number | string;
  nextDueDate?: string | Date | number;
  isActive?: boolean;
  endedAt?: string | Date | null;
}

// An item from /transactions/schedules: a recurring transaction cycle or a
// credit card statement, normalized to one shape.
export type ScheduleSource = "RECURRING" | "CREDIT_STATEMENT";

export interface ScheduleAccount {
  id: number;
  name: string;
  category?: string;
  color?: string | null;
  remainingBalance?: number | null;
}

export interface ScheduleCategory {
  id?: number;
  name?: string;
  color?: string;
  icon?: string;
}

export interface ScheduledItem {
  key: string;
  source: ScheduleSource;
  // RecurringTransaction id or CreditStatement id; null for a projected statement
  sourceId: number | null;
  type: ScheduleType;
  description: string;
  amount: number;
  dueDate: string;
  behaviour?: "AUTO_LOG" | "REMIND";
  interval?: number;
  unit?: string;
  category?: ScheduleCategory | null;
  fromAsset?: ScheduleAccount | null;
  toAsset?: ScheduleAccount | null;
  // Credit statements only
  status?: string | null;
  statementDate?: string;
  statementBalance?: number;
  minimumPaymentDue?: number;
  amountPaid?: number;
  // A future cycle shown for planning; it can't be paid/skipped yet
  projected: boolean;
  // Needs the user to pay/skip it (REMIND, or a failed AUTO_LOG)
  actionable: boolean;
  needsAttention: boolean;
  failureReason?: string | null;
}

export interface RecurringScheduleDetail {
  id: number;
  source: "RECURRING";
  type: ScheduleType;
  description: string;
  amount: number;
  dueDate: string;
  nextDueDate: string;
  startDate: string;
  endDate?: string | null;
  interval: number;
  unit: string;
  behaviour: "AUTO_LOG" | "REMIND";
  category?: ScheduleCategory | null;
  account?: ScheduleAccount | null;
  fromAsset?: ScheduleAccount | null;
  toAsset?: ScheduleAccount | null;
}

export interface ScheduleHistoryEntry {
  key: string;
  id: number;
  amount: number;
  date: string;
  status: string;
  dueDate?: string | null;
}

export interface CreditStatementDetail extends ScheduledItem {
  id: number;
  currentBalance?: number | null;
  creditLimit: number;
  interestCharged: number;
  lateFeeCharged: number;
  fees: { id: number; label: string; amount: number }[];
  payments: {
    id: number;
    amount: number;
    date: string;
    description?: string | null;
    fromAsset?: ScheduleAccount | null;
  }[];
}

export interface StackedBarSegment {
  label: string;
  value: number;
  color: string;
}

export interface BreakdownItem {
  name: string;
  amount: number;
  color: string;
}

export interface DashboardStatistics {
  expense?: number;
  income?: number;
  balance?: number;
  expenseTrend?: number;
  incomeTrend?: number;
  balanceTrend?: number;
  expenseBreakdown?: BreakdownItem[];
  incomeBreakdown?: BreakdownItem[];
  assetBreakdown?: { name: string; balance: number; color: string }[];
}

export interface statisticsWidgetProps {
  data?: DashboardStatistics;
  isLoading: boolean;
}

export interface commonWidgetProps extends statisticsWidgetProps {
  title: string;
  segments?: StackedBarSegment[];
  icon?: string;
}

export interface commonDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
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

export interface CategoryType {
  id: number;
  name: string;
  type: string;
  icon?: keyof typeof LucideIcon;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  hasTracker: boolean;
}

export interface CategoryTemplate {
  data: CategoryType[];
  message: string;
  success: boolean;
}

export interface filterProps {
  status?: string;
  search?: string;
  selectedCategories?: CategoryType[];
  selectedAssets?: { id: number; name: string }[];
}
