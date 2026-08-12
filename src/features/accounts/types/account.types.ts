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
  account?: AccountData;
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
}

export interface AccountTemplate {
  data: Account[];
  message: string;
  netWorth: number;
  success: boolean;
  total: number;
}

export interface AccountPayload {
  dateFrom?: string;
  dateTo?: string;
}

export interface CreditDetail {
  creditLimit: number;
  statementDate: number;
  dueDate: number;
  minimumPayment: number;
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
