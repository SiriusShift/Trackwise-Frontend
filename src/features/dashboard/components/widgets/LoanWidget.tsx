import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Construction } from "lucide-react";

function LoanBalance() {
  return (
    <Card
      className="gap-4        relative overflow-hidden border border-border/60 bg-card
        p-5 flex flex-col rounded-2xl shadow-sm col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1
        transition-shadow hover:shadow-md"
      //     style={{
      //       backgroundImage: `
      //   radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
      //   radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
      // `,
      //     }}
    >
      <CardHeader className="space-y-0 p-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold uppercase tracking-widesttracking-widest">
            Loan Balance
          </CardTitle>
          {/* <Link to="/loans" className="text-sm text-blue-400 hover:underline">
            See All
          </Link> */}
        </div>
        {/* <p className="text-sm text-muted-foreground mt-1">3 active loans</p> */}
      </CardHeader>

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
