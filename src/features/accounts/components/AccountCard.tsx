// src/pages/accounts/components/AccountCard.tsx
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { setActiveRow } from "@/shared/slices/activeSlice";
import { formatCurrency, hexToRgba } from "@/shared/utils/CustomFunctions";
import {
  Activity,
  Archive,
  ArchiveRestore,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Pencil,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useDispatch } from "react-redux";
import { ACCOUNT_SUBTYPES } from "../constants";
import { Account } from "../types/account.types";

export const LIABILITY_CATEGORIES = ["CREDIT", "LOAN"] as const;
export const isLiabilityCategory = (category: string) =>
  LIABILITY_CATEGORIES.includes(category.toUpperCase() as any);

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

const AccountCard = ({
  account,
  openDialog,
  onArchive,
  archived = false,
  onUnarchive,
}: {
  account: Account;
  openDialog?: () => void;
  onArchive?: () => void;
  archived?: boolean;
  onUnarchive?: () => void;
}) => {
  const dispatch = useDispatch();
  const { Icon, glowStyle, badgeStyle, ghostStyle } = getAccountConfig(
    account.category,
    account.subtype,
    account.color,
  );

  const handleEdit = () => {
    openDialog?.();
    dispatch(setActiveRow(account));
  };

  const isLiability = isLiabilityCategory(account.category);
  const sign =
    account.remainingBalance === 0 ? "" : isLiability ? "-" : "+";
  const balance = `${sign}${formatCurrency(
    Number(account.remainingBalance),
    account.currency,
    "symbol",
  )}`;

  // Always visible on touch devices; reveal on hover/focus for mouse users.
  const actionVisibility =
    "opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 transition-opacity duration-200";

  return (
    <Card className="group relative flex min-h-44 flex-col justify-between gap-4 overflow-hidden p-4 transition-all hover:shadow-md sm:min-h-48 sm:p-5">
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
        className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 -rotate-12 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 sm:h-32 sm:w-32"
        strokeWidth={1.5}
      />

      <div
        className={`absolute right-2 top-2 z-20 flex items-center gap-0.5 sm:right-3 sm:top-3 ${actionVisibility}`}
      >
        {archived ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-8 sm:w-8"
            onClick={onUnarchive}
            aria-label={`Unarchive ${account.name}`}
            title="Unarchive"
          >
            <ArchiveRestore className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8"
              onClick={onArchive}
              aria-label={`Archive ${account.name}`}
              title="Archive"
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8"
              onClick={handleEdit}
              aria-label={`Edit ${account.name}`}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative z-10 flex min-w-0 items-center gap-3 pr-20">
          <div
            style={badgeStyle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span
              className="truncate font-semibold leading-tight"
              title={account.name}
            >
              {account.name}
            </span>
            <span className="truncate text-xs capitalize text-muted-foreground">
              {account.category.toLowerCase()} • {account.currency}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start gap-1.5">
          <span
            className={`max-w-full truncate text-xl font-bold tracking-tight tabular-nums sm:text-2xl ${
              isLiability && account.remainingBalance !== 0
                ? "text-red-600"
                : ""
            }`}
            title={balance}
          >
            {balance}
          </span>
          {archived ? (
            <Badge variant="outline" className="w-fit text-[10px] font-normal">
              Archived · not in net worth
            </Badge>
          ) : (
            !account.includeInNetWorth && (
              <Badge variant="outline" className="w-fit text-[10px] font-normal">
                Excluded from net worth
              </Badge>
            )
          )}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
        <div
          className="flex min-w-0 items-center gap-1.5 text-emerald-600"
          title="Income this period"
        >
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          <span className="sr-only">Income</span>
          <span className="truncate tabular-nums">
            {formatCurrency(
              account.rangeIncome ?? 0,
              account.currency,
              "symbol",
            )}
          </span>
        </div>

        <div
          className="flex min-w-0 items-center gap-1.5 text-red-600"
          title="Expenses this period"
        >
          <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
          <span className="sr-only">Expenses</span>
          <span className="truncate tabular-nums">
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
