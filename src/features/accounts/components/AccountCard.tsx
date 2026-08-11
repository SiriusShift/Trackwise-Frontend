// src/pages/accounts/components/AccountCard.tsx
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  EllipsisVertical,
  Landmark,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Account } from "../types/account.types";

interface CategoryStyle {
  icon: LucideIcon;
  badge: string;
  glow: string; // background gradient blob
  ghost: string; // large watermark icon color
}

const categoryConfig: Record<string, CategoryStyle> = {
  BANK: {
    icon: Landmark,
    badge: "text-primary bg-primary/10",
    glow: "from-primary/15 via-primary/5 to-transparent",
    ghost: "text-primary/[0.06]",
  },
  CASH: {
    icon: Wallet,
    badge: "text-emerald-600 bg-emerald-500/10",
    glow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    ghost: "text-emerald-500/[0.06]",
  },
  CREDIT: {
    icon: CreditCard,
    badge: "text-violet-600 bg-violet-500/10",
    glow: "from-violet-500/15 via-violet-500/5 to-transparent",
    ghost: "text-violet-500/[0.06]",
  },
};

const getCategoryConfig = (category: string): CategoryStyle =>
  categoryConfig[category] ?? {
    icon: Wallet,
    badge: "text-muted-foreground bg-muted",
    glow: "from-muted-foreground/10 via-muted-foreground/5 to-transparent",
    ghost: "text-muted-foreground/[0.06]",
  };

const AccountCard = ({ account }: { account: Account }) => {
  const {
    icon: Icon,
    badge,
    glow,
    ghost,
  } = getCategoryConfig(account.category);

  return (
    <Card className="group relative flex flex-col gap-4 overflow-hidden p-5 transition-all hover:shadow-md">
      {/* background gradient blob */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${glow} blur-2xl`}
      />

      {/* watermark icon */}
      <Icon
        aria-hidden
        className={`pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rotate-[-12deg] ${ghost} transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105`}
        strokeWidth={1.5}
      />

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 z-10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <EllipsisVertical className="h-4 w-4" />
      </Button>

      <div className="relative z-10 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${badge}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold leading-tight">{account.name}</span>
          <span className="text-xs capitalize text-muted-foreground">
            {account.category.toLowerCase()} • {account.currency}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight">
          {formatCurrency(Number(account.balance), account.currency, "symbol")}
        </span>
        {!account.includeInNetWorth && (
          <Badge variant="outline" className="w-fit text-[10px] font-normal">
            Excluded from net worth
          </Badge>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          <span className="truncate">
            {formatCurrency(account.rangeIncome, account.currency, "symbol")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-red-600">
          <ArrowDownRight className="h-3.5 w-3.5" />
          <span className="truncate">
            {formatCurrency(account.rangeExpense, account.currency, "symbol")}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AccountCard;
