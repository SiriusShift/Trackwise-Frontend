import { commonDialogProps } from "@/shared/types";
import { type icons } from "lucide-react";
import z from "zod";
import { ACCOUNT_SUBTYPES } from "../constants";
import { accountSchema } from "../schema/account.schema";

export type AccountFormValues = z.infer<typeof accountSchema>;

export interface AccountData extends AccountFormValues {
  id: string;
}

export interface AccountDialogProps extends commonDialogProps {
  mode: string;
}

export type AccountCategory = keyof typeof ACCOUNT_SUBTYPES | "CASH";

export type IconName = keyof typeof icons;

export interface Account {
  id: number;
  name: string;
  category: AccountCategory;
  subtype?: string;

  balance: string;
  remainingBalance: number;

  currency: string;
  institution?: string;
  icon?: IconName;
  color?: string;

  includeInNetWorth: boolean;

  totalIncomes: number;
  totalExpenses: number;
  totalTransferOut: number;
  totalTransferIn: number;

  rangeIncome?: number;
  rangeExpense?: number;

  investmentPosition: InvestmentPosition | null;
  creditDetail: CreditDetail | null;
  loanDetail: LoanDetail | null;

  // Archived accounts only (GET /assets?archived=true)
  pausedRecurring?: PausedRecurring[];
}

// What unarchiving today does to a paused recurring item
export type ResumeAction = "RESUMES" | "ENDS" | "STAYS_PAUSED";

export interface PausedRecurring {
  id: number;
  type: "Expense" | "Income" | "Transfer";
  description: string;
  amount: string | number;
  fromAsset: { id: number; name: string } | null;
  toAsset: { id: number; name: string } | null;
  resume: {
    action: ResumeAction;
    nextDueDate: string | null;
    // Name of the other archived account holding a transfer back
    blockedBy: string | null;
  };
}

export interface ArchiveAccountPayload {
  id: number;
  archived?: boolean;
  // Paused recurring items to end instead of resuming (unarchive only)
  end?: number[];
}

export interface AccountTemplate {
  data: Account[];
  message: string;
  netWorth: number;
  liabilities: number;
  success: boolean;
  total: number;
}

export interface AccountPayload {
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
}

export interface CreditDetail {
  creditLimit: number;
  statementDate: number;
  // Either a day of the month or days after the statement date
  dueDate?: number | null;
  dueDaysAfterStatement?: number | null;
}

export interface LoanDetail {
  originalPrincipal: number;
  interestRate: number;
  interestPeriod: "MONTHLY" | "ANNUAL";
  interestMethod: "ADD_ON" | "REDUCING_BALANCE";
  termMonths: number;
  minimumPayment: number;
  nextDueDate: Date;
}

export interface InvestmentPosition {
  symbol: string;
  quantity: number;
  averageCostBasis: number;
  valuationCurrency: number;
  lastPrice: number;
  lastPriceAt: Date;
}
