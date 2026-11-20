import { IRootState } from "@/app/store";
import StatCard from "@/features/accounts/components/StatCard";
import {
  useArchiveAccountMutation,
  useGetAccountsQuery,
} from "@/shared/api/accountsApi";
import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import usePageTour from "@/shared/tour/usePageTour";
import {
  formatCurrency,
  handleCatchErrorMessage,
} from "@/shared/utils/CustomFunctions";
import {
  Archive,
  ArrowUpDown,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AccountCard from "../components/AccountCard";
import AccountCardSkeleton from "../components/AccountCardSkeleton";
import AccountDialog from "../components/AccountDialog";
import UnarchiveDialog from "../components/UnarchiveDialog";
import { Account } from "../types/account.types";

const stats = [
  {
    title: "Net Worth",
    key: "netWorth",
    icon: Wallet,
    color: "text-primary bg-primary/10",
  },
  {
    title: "Assets",
    key: "total",
    icon: Landmark,
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "Liabilities",
    key: "liabilities",
    icon: ArrowUpDown,
    color: "text-red-600 bg-red-500/10",
  },
  {
    title: "Accounts",
    key: "count",
    icon: CreditCard,
    color: "text-violet-600 bg-violet-500/10",
  },
];

const AccountPage = () => {
  const { Tour } = usePageTour("accounts");
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("add");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [unarchiving, setUnarchiving] = useState<Account | null>(null);

  const startDate = useSelector(
    (state: IRootState) => state.active.active.from,
  );
  const currency = useSelector((state: IRootState) => state.settings.currency);
  const endDate = useSelector((state: IRootState) => state.active.active.to);

  const { confirm } = useConfirm();
  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsQuery({
      dateFrom: startDate,
      dateTo: endDate,
    });

  // Fetched up front so the switch can show its count
  const { data: archivedData, isLoading: archivedLoading } =
    useGetAccountsQuery({ archived: true });

  const [archive] = useArchiveAccountMutation();
  const handleAdd = () => {
    setMode("Add");
    setOpen(true);
  };

  const handleEdit = () => {
    setMode("Edit");
    setOpen(true);
  };

  const handleArchive = (account: Account) => {
    const balance = Number(account.remainingBalance);
    const hasBalance = Math.abs(balance) >= 0.005;

    confirm({
      title: `Archive ${account.name}?`,
      description: (
        <span className="flex flex-col gap-2">
          <span>
            Its transactions stay in your history and reports, but its money
            can't change until you unarchive it. Recurring items that use it
            are paused.
          </span>
          {hasBalance && (
            <span className="font-medium text-amber-600">
              Its balance of{" "}
              {formatCurrency(balance, account.currency, "symbol")} will no
              longer count toward your net worth.
            </span>
          )}
        </span>
      ),
      variant: hasBalance ? "warning" : "info",
      confirmText: "Archive",
      showLoadingOnConfirm: true,
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await archive({ id: account.id }).unwrap();
          toast.success(`${account.name} archived.`);
        } catch (err) {
          console.log(err);
          toast.error(handleCatchErrorMessage(err));
        }
      },
    });
  };

  const assetsLength = accountsData?.data?.length ?? 0;
  const archivedLength = archivedData?.data?.length ?? 0;
  const listLoading = showArchived ? archivedLoading : accountsLoading;
  const listLength = showArchived ? archivedLength : assetsLength;
  const excludedAccountsLength =
    accountsData?.data?.filter((item) => !item.includeInNetWorth)?.length ?? 0;

  const statistics = stats.map((item) => {
    switch (item.key) {
      case "netWorth":
        return {
          ...item,
          value: accountsData?.netWorth ?? 0,
        };

      case "total":
        return {
          ...item,
          value: accountsData?.total ?? 0,
        };

      case "liabilities":
        return {
          ...item,
          value: accountsData?.liabilities ?? 0,
        };

      default:
        return {
          ...item,
          value: assetsLength,
        };
    }
  });

  return (
    <>
      {Tour}
      <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        <PageHeader
          pageName="Accounts"
          description="Manage and track your accounts"
          monthPicker={true}
        >
          <Label
            htmlFor="show-archived"
            className="flex cursor-pointer items-center gap-2 px-1 text-sm font-normal text-muted-foreground"
          >
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <span>
              <span className="hidden sm:inline">Show </span>archived
              {archivedLength > 0 && (
                <span className="ms-1.5 rounded-full bg-muted-foreground/15 px-1.5 text-xs tabular-nums">
                  {archivedLength}
                </span>
              )}
            </span>
          </Label>
          <Button
            data-tour="add-account"
            onClick={handleAdd}
            aria-label="Add account"
            className="px-2.5 sm:px-4"
          >
            <Plus /> <span className="hidden sm:inline">Add account</span>
          </Button>
        </PageHeader>

        <div
          data-tour="account-stats"
          className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-5"
        >
          {statistics.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              icon={stat.icon}
              color={stat.color}
              loading={accountsLoading}
              value={
                stat.key !== "count"
                  ? formatCurrency(stat.value, currency, "symbol")
                  : stat.value
              }
              footer={
                stat.key === "count" &&
                excludedAccountsLength > 0 &&
                `ⓘ Excluded ${excludedAccountsLength} account${excludedAccountsLength > 1 ? "s" : ""}`
              }
            />
          ))}
        </div>
        {!listLoading && listLength > 0 && (
          <div className="-mb-1 flex items-baseline justify-between gap-2 pt-1">
            <h2 className="text-base font-medium tracking-tight">
              {showArchived ? "Archived accounts" : "Your accounts"}
            </h2>
            <span className="text-xs text-muted-foreground">
              {listLength} total
              {!showArchived &&
                excludedAccountsLength > 0 &&
                ` · ${excludedAccountsLength} excluded`}
            </span>
          </div>
        )}
        <div
          data-tour="account-list"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:gap-5 2xl:grid-cols-4"
        >
          {listLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <AccountCardSkeleton key={i} />
            ))
          ) : showArchived && archivedLength === 0 ? (
            <Card className="col-span-full flex flex-col items-center justify-center gap-3 border-dashed p-6 text-center sm:p-10">
              <div className="rounded-full bg-muted p-3 text-muted-foreground">
                <Archive className="h-6 w-6" />
              </div>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                No archived accounts. Archive an account you no longer use to
                hide it while keeping its history.
              </p>
            </Card>
          ) : showArchived ? (
            archivedData?.data?.map((account: Account) => (
              <AccountCard
                key={account.id}
                account={account}
                archived
                onUnarchive={() => setUnarchiving(account)}
              />
            ))
          ) : listLength === 0 ? (
            <Card className="col-span-full flex flex-col items-center justify-center gap-3 border-dashed p-6 text-center sm:p-10">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">No accounts yet</p>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Add a bank account, e-wallet, cash or credit card to get
                  started.
                </p>
              </div>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4" /> Add account
              </Button>
            </Card>
          ) : (
            accountsData?.data?.map((account: Account) => (
              <AccountCard
                key={account.id}
                account={account}
                openDialog={handleEdit}
                onArchive={() => handleArchive(account)}
              />
            ))
          )}
        </div>
      </div>
      <AccountDialog open={open} setOpen={setOpen} mode={mode} />
      <UnarchiveDialog
        account={unarchiving}
        onClose={() => setUnarchiving(null)}
      />
    </>
  );
};

export default AccountPage;
