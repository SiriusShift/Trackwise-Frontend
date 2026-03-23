import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
const savingsPlans = [
  {
    icon: "✈️",
    name: "Travel",
    saved: 5392,
    goal: 35200,
    target: "Dec 2026",
    color: "bg-blue-500",
    pctColor: "text-blue-400",
  },
  {
    icon: "🏠",
    name: "Emergency Fund",
    saved: 24600,
    goal: 40000,
    target: "Jun 2026",
    color: "bg-green-500",
    pctColor: "text-green-400",
  },
  {
    icon: "💻",
    name: "New Laptop",
    saved: 6900,
    goal: 55000,
    target: "Mar 2027",
    color: "bg-amber-500",
    pctColor: "text-amber-400",
  },
];

const totalSaved = savingsPlans.reduce((s, p) => s + p.saved, 0);
const totalGoal = savingsPlans.reduce((s, p) => s + p.goal, 0);
const overallPct = ((totalSaved / totalGoal) * 100).toFixed(1);

function SavingsPlan() {
  return (
    <Card
      className=" relative overflow-hidden border border-border/60 bg-card
        flex flex-col p-5 rounded-2xl shadow-sm col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1
        transition-shadow hover:shadow-md"
      style={{
        backgroundImage: `
    radial-gradient(circle at 80% 120%, rgba(96, 165, 250, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 20% 120%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
  `,
      }}
    >
      <CardHeader className="flex flex-row w-full justify-between p-0 mb-5">
        <CardTitle>
          <h1 className="text-sm font-semibold uppercase tracking-widest">
            Savings Plan
          </h1>

          {/* <p className="text-xs text-muted-foreground mt-0.5">
              {savingsPlans?.length} active plan
              {savingsPlans?.length !== 1 ? "s" : ""}
            </p> */}
        </CardTitle>
        {/* <Link
          to="/funds"
          className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          See All →
        </Link> */}
      </CardHeader>

      <CardContent className="p-0 flex-col hidden gap-0">
        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            {
              label: "Total saved",
              value: `₱${totalSaved.toLocaleString("en-PH")}`,
              color: "",
            },
            {
              label: "Total goal",
              value: `₱${totalGoal.toLocaleString("en-PH")}`,
              color: "",
            },
            {
              label: "Overall",
              value: `${overallPct}%`,
              color: "text-blue-400",
            },
          ].map((chip) => (
            <div key={chip.label} className="bg-muted/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">
                {chip.label}
              </p>
              <p className={`text-sm font-medium ${chip.color}`}>
                {chip.value}
              </p>
            </div>
          ))}
        </div>

        {/* Individual plans */}
        <div className="divide-y divide-border/40">
          {savingsPlans.map((plan) => {
            const pct = ((plan.saved / plan.goal) * 100).toFixed(1);
            return (
              <div key={plan.name} className="py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-base flex-shrink-0">
                  {plan.icon}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{plan.name}</span>
                    <span className={`text-xs font-medium ${plan.pctColor}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${plan.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      ₱{plan.saved.toLocaleString("en-PH")} / ₱
                      {plan.goal.toLocaleString("en-PH")}
                    </span>
                    <span>
                      Target{" "}
                      <span className="text-foreground/70">{plan.target}</span>
                    </span>
                  </div>
                </div>
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

export default SavingsPlan;
