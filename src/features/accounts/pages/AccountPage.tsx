import { IRootState } from "@/app/store";
import { useGetAccountsQuery } from "@/shared/api/accountsApi";
import PageHeader from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
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

const stats = [
  {
    title: "Net Worth",
    value: formatCurrency(5000, "PHP", "symbol"),
    icon: Wallet,
    color: "text-primary bg-primary/10",
  },
  {
    title: "Assets",
    value: formatCurrency(5000, "PHP", "symbol"),
    icon: Landmark,
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    title: "Liabilities",
    value: formatCurrency(5000, "PHP", "symbol"),
    icon: ArrowUpDown,
    color: "text-red-600 bg-red-500/10",
  },
  {
    title: "Accounts",
    value: "4",
    icon: CreditCard,
    color: "text-violet-600 bg-violet-500/10",
  },
];

const AccountPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("add");

  const startDate = useSelector(
    (state: IRootState) => state.active.active.from,
  );
  const endDate = useSelector((state: IRootState) => state.active.active.to);

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsQuery({
      dateFrom: startDate,
      dateTo: endDate,
    });

  const handleAdd = () => {
    setMode("Add");
    setOpen(true);
  };
  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <PageHeader
          pageName="Accounts"
          description="Manage and track your accounts"
          monthPicker={true}
        >
          <div className="flex flex-row gap-2">
            <Button variant={"ghost"}>
              <ArrowLeftRight />
              Transfer
            </Button>
            <Button onClick={handleAdd}>
              <Plus /> Add
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="group relative overflow-hidden p-5 transition-all border border-border/50 bg-muted/40 hover:bg-muted/60"
              >
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button> */}

                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {stat.title}
                    </span>

                    <span className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {/* <h2 className="text-lg font-medium tracking-tight">Accounts</h2> */}
        <div className="grid grid-cols-4 gap-5">
          {accountsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
              ))
            : accountsData?.data?.map((account: Account) => (
                <AccountCard key={account.id} account={account} />
              ))}
        </div>
      </div>
      <AccountDialog open={open} setOpen={setOpen} mode={mode} />
    </>
  );
};

export default AccountPage;
