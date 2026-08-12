import {
  Banknote,
  Bitcoin,
  Building2,
  Car,
  ChartCandlestick,
  ChartNoAxesCombined,
  Coins,
  CreditCard,
  Gem,
  HandCoins,
  Handshake,
  Home,
  House,
  Landmark,
  PieChart,
  PiggyBank,
  ScrollText,
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
  CASH: [
    {
      value: "CASH",
      label: "Cash",
      icon: Banknote,
    },
  ],
  BANK: [
    {
      value: "SAVINGS",
      label: "Savings",
      icon: Landmark,
    },
    {
      value: "CHECKING",
      label: "Checking",
      icon: Wallet,
    },
    {
      value: "E_WALLET",
      label: "E-Wallet",
      icon: Smartphone,
    },
  ],

  CREDIT: [
    {
      value: "CREDIT_CARD",
      label: "Credit Card",
      icon: CreditCard,
    },
    {
      value: "LINE_OF_CREDIT",
      label: "Line of Credit",
      icon: HandCoins,
    },
  ],

  LOAN: [
    {
      value: "PERSONAL",
      label: "Personal Loan",
      icon: Handshake,
    },
    {
      value: "HOME",
      label: "Home Loan",
      icon: House,
    },
    {
      value: "AUTO",
      label: "Auto Loan",
      icon: Car,
    },
  ],

  INVESTMENT: [
    {
      value: "STOCK",
      label: "Stock",
      icon: ChartCandlestick,
    },
    {
      value: "ETF",
      label: "ETF",
      icon: ChartNoAxesCombined,
    },
    {
      value: "CRYPTO",
      label: "Crypto",
      icon: Bitcoin,
    },
    {
      value: "MUTUAL_FUND",
      label: "Mutual Fund",
      icon: PieChart,
    },
    {
      value: "BOND",
      label: "Bond",
      icon: ScrollText,
    },
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
