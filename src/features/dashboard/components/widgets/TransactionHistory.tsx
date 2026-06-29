import { useGetTransactionHistoryQuery } from "@/features/transactions/api/transaction";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import * as Icons from "lucide-react";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ease: [0.25, 0.1, 0.25, 1], duration: 0.35 },
  },
};

function TransactionIcon({ icon }: { icon?: string }) {
  const LucidIcon = (icon && Icons[icon as keyof typeof Icons]) as
    | React.ElementType
    | undefined;
  if (!LucidIcon) return null;
  return (
    <div className="w-9 h-9 rounded-lg flex-shrink-0 flex justify-center items-center bg-muted border border-border/60">
      <LucidIcon className="text-muted-foreground" width={16} height={16} />
    </div>
  );
}

function AmountLabel({
  type,
  categoryName,
  amount,
}: {
  type: string;
  categoryName: string;
  amount: number;
}) {
  const colorClass =
    type === "Income"
      ? "text-emerald-500"
      : type === "Transfer"
        ? "text-foreground"
        : "text-destructive";

  const prefix = type === "Income" ? "+" : type === "Transfer" ? "" : "-";

  return (
    <span
      className={`${colorClass} font-medium text-sm whitespace-nowrap tabular-nums`}
    >
      {prefix}
      {formatCurrency(amount)}
    </span>
  );
}

const TransactionHistory = () => {
  const { data, isFetching } = useGetTransactionHistoryQuery({
    pageSize: 3,
    pageIndex: 0,
  });

  const transactions = data?.data ?? [];

  console.log(data);
  const isEmpty = !isFetching && transactions.length === 0;

  return (
    <Card
      className="relative border border-border/60 p-5 gap-4 bg-card flex flex-col rounded-2xl shadow-sm col-span-full md:col-span-4 xl:col-span-1 transition-shadow hover:shadow-md"
      // style={{
      //   backgroundImage: `
      //     radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
      //     radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
      //   `,
      // }}
    >
      {/* Top accent */}
      {/* <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" /> */}

      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Recent Transactions
          </CardTitle>
          <Link
            to="/transactions"
            className="text-xs text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            See All →
          </Link>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-0">
        {isFetching ? (
          <div className="space-y-3 py-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-muted/20 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Icons.FileX className="text-muted-foreground" size={22} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                No data available
              </p>
              <p className="text-xs text-muted-foreground">
                There’s nothing to display right now.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center p-2 gap-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors duration-150 cursor-pointer border"
              >
                <TransactionIcon icon={item.category?.icon} />

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate text-foreground"
                    title={item?.description}
                  >
                    {item?.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item?.category?.name}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <AmountLabel
                    type={item?.type}
                    categoryName={item?.category?.name}
                    amount={item?.amount}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {moment(item?.date).format("MMM DD, h:mm A")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;
