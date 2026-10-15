import { Card } from "@/shared/components/ui/card";
import {
  ArrowLeftRight,
  CalendarDays,
  PiggyBank,
  Receipt,
  Repeat,
  TrendingUp,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Receipt,
    title: "Expenses",
    desc: "Log spending by category, attach receipts, and see where each peso goes.",
  },
  {
    icon: TrendingUp,
    title: "Income",
    desc: "Track salary, side income, and other money coming in, next to your spending.",
  },
  {
    icon: ArrowLeftRight,
    title: "Transfers",
    desc: "Move money between accounts and keep balances accurate on both sides.",
  },
  {
    icon: Repeat,
    title: "Recurring transactions",
    desc: "Set up bills, subscriptions, and paychecks once. They are scheduled automatically.",
  },
  {
    icon: PiggyBank,
    title: "Budgets",
    desc: "Set a limit per category and watch progress through the month.",
  },
  {
    icon: CalendarDays,
    title: "Calendar of due dates",
    desc: "See upcoming bills and payments on a calendar so nothing is missed.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="scroll-mt-16 pt-20 pb-4 lg:pt-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Everything in one place</h2>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Record what comes in and goes out, and see how it adds up across your accounts.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <ScrollReveal
            key={title}
            className="h-full"
            fromScale={0.96}
            fromOpacity={0.3}
            fromY={24}
          >
            <Card className="h-full p-6 transition-colors hover:border-primary/50 hover:bg-card/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
