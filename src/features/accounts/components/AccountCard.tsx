// src/pages/accounts/components/AccountCard.tsx
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCurrency, hexToRgba } from "@/shared/utils/CustomFunctions";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  EllipsisVertical,
} from "lucide-react";
import type { CSSProperties } from "react";
import { ACCOUNT_SUBTYPES } from "../constants";
import { Account } from "../types/account.types";

const getSubtypeIcon = (
  category?: keyof typeof ACCOUNT_SUBTYPES,
  subtype?: string,
) => {
  if (!category) return Activity;

  if (category === "CASH") return Banknote;

  return (
    ACCOUNT_SUBTYPES[category]?.find((item) => item.value === subtype)?.icon ??
    Activity
  );
};

const getAccountConfig = (
  category: keyof typeof ACCOUNT_SUBTYPES,
  subtype: string | undefined,
  color: string | undefined,
) => {
  const Icon = getSubtypeIcon(category, subtype);
  const accent = color ?? "#6366f1"; // fallback when the asset has no color set

  const glowStyle: CSSProperties = {
    backgroundImage: `radial-gradient(circle, ${hexToRgba(accent, 0.15)}, ${hexToRgba(accent, 0.05)} 60%, transparent)`,
  };
  const badgeStyle: CSSProperties = {
    color: accent,
    backgroundColor: hexToRgba(accent, 0.1),
  };
  const ghostStyle: CSSProperties = {
    color: hexToRgba(accent, 0.06),
  };

  return { Icon, glowStyle, badgeStyle, ghostStyle };
};

const AccountCard = ({ account }: { account: Account }) => {
  const { Icon, glowStyle, badgeStyle, ghostStyle } = getAccountConfig(
    account.category,
    account.subtype,
    account.color,
  );

  return (
    <Card className="group relative flex flex-col gap-4 overflow-hidden p-5 transition-all hover:shadow-md">
      {/* background gradient blob */}
      <div
        aria-hidden
        style={glowStyle}
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
      />

      {/* watermark icon */}
      <Icon
        aria-hidden
        style={ghostStyle}
        className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rotate-[-12deg] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"
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
          style={badgeStyle}
          className="flex h-11 w-11 items-center justify-center rounded-xl"
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
          {formatCurrency(Number(account.remainingBalance), account.currency, "symbol")}
        </span>
        {!account.includeInNetWorth && (
          <Badge variant="outline" className="w-fit text-[10px] font-normal">
            Excluded
          </Badge>
        )}{" "}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          <span className="truncate">
            {formatCurrency(
              account.rangeIncome ?? 0,
              account.currency,
              "symbol",
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-red-600">
          <ArrowDownRight className="h-3.5 w-3.5" />
          <span className="truncate">
            {formatCurrency(
              account.rangeExpense ?? 0,
              account.currency,
              "symbol",
            )}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AccountCard;
