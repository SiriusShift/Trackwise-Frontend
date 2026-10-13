import { Card } from "@/shared/components/ui/card";

const steps = [
  {
    title: "Add your accounts",
    desc: "Add bank accounts, e-wallets, and credit cards with their starting balances.",
  },
  {
    title: "Record or schedule",
    desc: "Log transactions as they happen, or schedule the ones that repeat.",
  },
  {
    title: "Review your month",
    desc: "Check the dashboard, budgets, and reports to see how the month went.",
  },
];

const StepsSection = () => (
  <section id="how-it-works" className="scroll-mt-16 border-b border-border/60 py-20 lg:py-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="text-center text-3xl font-bold tracking-tight">Set up in three steps</h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(({ title, desc }, i) => (
          <Card key={title} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step {i + 1}
            </p>
            <h3 className="mt-2 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default StepsSection;
