// The mock card statement mirrors the look of StatementPreview. Sample data only.
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import ScrollReveal from "./ScrollReveal";

const money = (n: number) => formatCurrency(n);

const points = [
  "Monthly statements with charges and payments in one view",
  "Minimum payment tracking with a floor you set",
  "Due dates added to your calendar automatically",
  "Installment and loan payments tracked alongside your cards",
];

const summary = [
  { label: "Statement balance", value: money(1842.5), tone: "" },
  { label: "Paid so far", value: money(600), tone: "text-success" },
  { label: "Interest & fees", value: money(24.5), tone: "text-destructive" },
  { label: "Remaining", value: money(1242.5), tone: "accent" },
];

const rows = [
  { date: "Sep 4, 2026", desc: "Groceries", sub: "Food", amount: 186.4 },
  { date: "Sep 9, 2026", desc: "Phone 12 of 12", sub: "Installment", amount: 120 },
  { date: "Sep 15, 2026", desc: "Flight tickets", sub: "Travel", amount: 940 },
  { date: "Sep 22, 2026", desc: "Streaming", sub: "Subscriptions", amount: 15.6 },
];

const payments = [{ date: "Sep 28, 2026", from: "Main Checking", amount: 600 }];

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const point = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, bounce: 0, duration: 0.6 },
  },
};

const check = {
  hidden: { scale: 0.6 },
  show: {
    scale: 1,
    transition: { type: "spring" as const, bounce: 0.3, duration: 0.5 },
  },
};

const columns = "grid-cols-[18fr_52fr_30fr]";

const CreditStatementPreview = () => (
  <ScrollReveal fromScale={0.96} fromOpacity={0.3} fromY={24}>
    <div
      role="img"
      aria-label="Sample Trackwise credit card statement showing the statement balance, payments made, and the remaining amount due"
      className="overflow-hidden rounded-xl border border-border bg-card p-5 text-[11px] text-card-foreground shadow-2xl shadow-primary/10 sm:p-7"
    >
      <div className="flex items-end justify-between border-b-2 border-primary pb-3">
        <div>
          <p className="text-xl font-bold text-primary">Trackwise</p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">
            Credit card statement
          </p>
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-warning align-middle" />
          Partially paid
        </span>
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 rounded-md bg-muted px-3 py-2.5">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Card
          </p>
          <p className="mt-0.5 text-xs font-bold">Visa Platinum</p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Statement date
          </p>
          <p className="mt-0.5 text-xs font-bold">Sep 30, 2026</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Due date
          </p>
          <p className="mt-0.5 text-xs font-bold">Oct 25, 2026</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {summary.map((s) => (
          <div
            key={s.label}
            className={`rounded-md border px-2.5 py-2 ${
              s.tone === "accent"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border"
            }`}
          >
            <p
              className={`text-[8px] uppercase tracking-wider ${
                s.tone === "accent"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            >
              {s.label}
            </p>
            <p
              className={`mt-1 text-[11px] font-bold ${
                s.tone === "accent" ? "" : s.tone
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[320px]">
          <div
            className={`grid ${columns} rounded-sm bg-primary px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground`}
          >
            <span>Date</span>
            <span>Charge</span>
            <span className="text-right">Amount</span>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.date}
              className={`grid ${columns} items-center border-b border-border/60 px-2 py-1.5 ${
                i % 2 === 1 ? "bg-muted/50" : ""
              }`}
            >
              <span>{r.date}</span>
              <span className="pr-2">
                {r.desc}
                <span className="block text-[8px] text-muted-foreground">
                  {r.sub}
                </span>
              </span>
              <span className="text-right font-bold">{money(r.amount)}</span>
            </div>
          ))}
          <div className={`grid ${columns} px-2 py-1.5 text-muted-foreground`}>
            <span />
            <span>Interest &amp; fees</span>
            <span className="text-right tabular-nums">{money(24.5)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        Payments
      </p>
      {payments.map((p) => (
        <div
          key={p.date}
          className="mt-1.5 flex items-center justify-between rounded-md border border-border px-3 py-2"
        >
          <div>
            <p>{p.date}</p>
            <p className="text-[8px] text-muted-foreground">From {p.from}</p>
          </div>
          <p className="font-bold text-success">{money(p.amount)}</p>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-2 text-[8px] text-muted-foreground">
        <span>Generated automatically by Trackwise · Visa Platinum</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  </ScrollReveal>
);

const CreditCardSection = () => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section
      id="credit-cards"
      className="scroll-mt-16 border-b border-border/60 bg-card/30 py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 *:min-w-0">
        <div>
          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, ...(isMobile ? { y: 16 } : { x: -32 }) }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Credit card billing, month by month
            </h2>
            <p className="mt-3 text-muted-foreground">
              Track each statement cycle from start to finish, so you always know
              what is due and what you have paid.
            </p>
          </motion.div>
          <motion.ul
            variants={list}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-6 space-y-3"
          >
            {points.map((text) => (
              <motion.li
                key={text}
                variants={point}
                className="flex items-start gap-3 text-sm"
              >
                <motion.span
                  variants={check}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <CreditStatementPreview />
      </div>
    </section>
  );
};

export default CreditCardSection;
