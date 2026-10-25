import { IRootState } from "@/app/store";
import {
  useArchiveAccountMutation,
  useGetAccountsQuery,
} from "@/shared/api/accountsApi";
import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import StatCard from "@/features/accounts/components/StatCard";
import {
  formatCurrency,
  handleCatchErrorMessage,
} from "@/shared/utils/CustomFunctions";
import {
  ArrowLeftRight,
  ArrowUpDown,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import AccountCard from "../components/AccountCard";
import AccountCardSkeleton from "../components/AccountCardSkeleton";
import AccountDialog from "../components/AccountDialog";
import { Account } from "../types/account.types";
import { useConfirm } from "@/shared/provider/ConfirmProvider";
import { toast } from "sonner";
import usePageTour from "@/shared/tour/usePageTour";

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

  const [archive, { isLoading }] = useArchiveAccountMutation();
  const handleAdd = () => {
    setMode("Add");
    setOpen(true);
  };

  const handleEdit = () => {
    setMode("Edit");
    setOpen(true);
  };

  const handleArchive = (id : number) => {
    confirm({
      description: `Are you sure you want to archive this account?`,
      title: `Archive account`,
      variant: "info",
      confirmText: "Confirm",
      showLoadingOnConfirm: true,
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await archive(id).unwrap();
        } catch (err) {
          console.log(err);
          toast.error(handleCatchErrorMessage(err));
        }
      },
    });
  };

  const assetsLength = accountsData?.data?.length ?? 0;
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
      <div className="flex flex-col gap-5 p-5">
        <PageHeader
          pageName="Accounts"
          description="Manage and track your accounts"
          monthPicker={true}
        >
          <div className="flex flex-row gap-2">
            {/* <Button variant={"ghost"}>
              <ArrowLeftRight />
              Transfer
            </Button> */}
            <Button data-tour="add-account" onClick={handleAdd}>
              <Plus /> Add
            </Button>
          </div>
        </PageHeader>

        <div
          data-tour="account-stats"
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
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
        {/* <h2 className="text-lg font-medium tracking-tight">Accounts</h2> */}
        <div
          data-tour="account-list"
          className="grid grid-cols-1  sm:grid-cols-2  xl:grid-cols-4 gap-5"
        >
          {accountsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
              ))
            : assetsLength === 0
              ? (
                <Card className="col-span-full flex flex-col items-center justify-center gap-3 border-dashed p-10 text-center">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">No accounts yet</p>
                    <p className="text-sm text-muted-foreground">
                      Add a bank account, e-wallet, cash or credit card to get
                      started.
                    </p>
                  </div>
                  <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4" /> Add account
                  </Button>
                </Card>
              )
              : accountsData?.data?.map((account: Account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  openDialog={handleEdit}
                  onArchive={() => handleArchive(account.id)}
                />
              ))}
        </div>
      </div>
      <AccountDialog open={open} setOpen={setOpen} mode={mode} />
    </>
  );
};

export default AccountPage;
