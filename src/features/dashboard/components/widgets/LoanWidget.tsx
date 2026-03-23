import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

const loans = [
  {
    name: "Car Loan",
    paid: 450000,
    total: 1000000,
    nextDue: "Apr 5",
    nextAmount: "₱12,500",
    status: "on-track" as const,
  },
  {
    name: "Home Mortgage",
    paid: 9800000,
    total: 48000000,
    nextDue: "Mar 1",
    nextAmount: "₱35,000",
    status: "overdue" as const,
  },
];

const totalPaid = 10732012.52;
const totalLoan = 50023012.2;
const totalPct = ((totalPaid / totalLoan) * 100).toFixed(1);
const totalRemaining = (totalLoan - totalPaid).toLocaleString("en-PH", {
  maximumFractionDigits: 0,
});

function LoanBalance() {
  return (
    <Card className="gap-4        relative overflow-hidden border border-border/60 bg-card
        p-5 flex flex-col rounded-2xl shadow-sm col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1
        transition-shadow hover:shadow-md"
      style={{
        backgroundImage: `
    radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
  `,
      }}>
      <CardHeader className="space-y-0 p-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold uppercase tracking-widesttracking-widest">Loan Balance</CardTitle>
          {/* <Link to="/loans" className="text-sm text-blue-400 hover:underline">
            See All
          </Link> */}
        </div>
        {/* <p className="text-sm text-muted-foreground mt-1">3 active loans</p> */}
      </CardHeader>

      <CardContent className="flex-col gap-0 p-0 hidden">
        {/* Master progress */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-medium">
              ₱{totalPaid.toLocaleString("en-PH")}
            </span>
            <span className="text-sm text-muted-foreground">
              of ₱{totalLoan.toLocaleString("en-PH")}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{totalPct}% repaid</span>
            <span>₱{totalRemaining} remaining</span>
          </div>
        </div>

        {/* Individual loans */}
        <div className="divide-y divide-border/40">
          {loans.map((loan) => {
            const pct = ((loan.paid / loan.total) * 100).toFixed(1);
            const isOverdue = loan.status === "overdue";
            const barColor = isOverdue
              ? "bg-red-500"
              : pct >= "50"
                ? "bg-green-500"
                : "bg-blue-500";
            const pctColor = isOverdue
              ? "text-red-400"
              : pct >= "50"
                ? "text-green-400"
                : "text-blue-400";

            return (
              <div key={loan.name} className="py-3 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{loan.name}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isOverdue
                        ? "bg-red-500/15 text-red-400"
                        : "bg-green-500/15 text-green-400"
                    }`}
                  >
                    {isOverdue ? "Overdue" : "On track"}
                  </span>
                </div>

                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    ₱{loan.paid.toLocaleString("en-PH")} / ₱
                    {loan.total.toLocaleString("en-PH")}
                  </span>
                  <span className={pctColor}>{pct}%</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {isOverdue ? (
                    <>
                      Was due{" "}
                      <span className="text-red-400">
                        {loan.nextDue} — {loan.nextAmount}
                      </span>
                    </>
                  ) : (
                    <>
                      Next due{" "}
                      <span className="text-foreground/70">
                        {loan.nextDue} — {loan.nextAmount}
                      </span>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>

       <CardContent className="relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-border/50 text-center h-full">
        {/* Background */}
        <div className="absolute inset-0 opacity-20 animate-[moveBg_6s_linear_infinite]">
          <div
            className="absolute inset-0 blur-[2px]"
            style={{
              backgroundImage: `
          repeating-linear-gradient(
            135deg,
            rgba(252, 255, 0, 0.15) 0px,
            rgba(252, 255, 0, 0.15) 12px,
            transparent 12px,
            transparent 24px
          )
        `,
            }}
          />
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
          <Construction className="w-5 h-5 text-yellow-500" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight">
            Under development
          </p>
          <p className="text-xs text-muted-foreground">
            This feature is coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoanBalance;
