import {
  Banknote,
  Building2,
  Car,
  Coins,
  CreditCard,
  Gem,
  Home,
  Landmark,
  PiggyBank,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const ACCOUNT_TYPES = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank Account" },
  { value: "CREDIT", label: "Credit" },
  { value: "LOAN", label: "Loan" },
  { value: "INVESTMENT", label: "Investment" },
] as const;

// Keyed by AssetCategory — CASH intentionally has no entry (no subtype),
// matching the AssetSubtype mapping documented in schema.prisma.
export const ACCOUNT_SUBTYPES = {
  BANK: [
    { value: "SAVINGS", label: "Savings" },
    { value: "CHECKING", label: "Checking" },
    { value: "E_WALLET", label: "E-Wallet" },
  ],
  CREDIT: [
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "LINE_OF_CREDIT", label: "Line of Credit" },
  ],
  LOAN: [
    { value: "PERSONAL", label: "Personal Loan" },
    { value: "HOME", label: "Home Loan" },
    { value: "AUTO", label: "Auto Loan" },
  ],
  INVESTMENT: [
    { value: "STOCK", label: "Stock" },
    { value: "ETF", label: "ETF" },
    { value: "CRYPTO", label: "Crypto" },
    { value: "MUTUAL_FUND", label: "Mutual Fund" },
    { value: "BOND", label: "Bond" },
  ],
} as const;

// Stored as a plain string key (Asset.icon) so it's stable across icon-set
// changes — the lookup table below is what actually resolves it to a component.
export const ICON_OPTIONS = [
  { value: "wallet", label: "Wallet", Icon: Wallet },
  { value: "credit-card", label: "Credit Card", Icon: CreditCard },
  { value: "landmark", label: "Bank", Icon: Landmark },
  { value: "piggy-bank", label: "Savings", Icon: PiggyBank },
  { value: "banknote", label: "Cash", Icon: Banknote },
  { value: "coins", label: "Coins", Icon: Coins },
  { value: "trending-up", label: "Investment", Icon: TrendingUp },
  { value: "building", label: "Institution", Icon: Building2 },
  { value: "home", label: "Home Loan", Icon: Home },
  { value: "car", label: "Auto Loan", Icon: Car },
  { value: "smartphone", label: "E-Wallet", Icon: Smartphone },
  { value: "shopping-bag", label: "Spending", Icon: ShoppingBag },
  { value: "gem", label: "Assets", Icon: Gem },
] as const;
