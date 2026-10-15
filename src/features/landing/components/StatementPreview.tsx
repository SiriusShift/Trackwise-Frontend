// Themed HTML mock of the PDF in features/transactions/components/reports/TransactionStatement.tsx.
// Sample data only; keep the layout in sync with the PDF.
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import ScrollReveal from "./ScrollReveal";

const money = (n: number) => formatCurrency(n);

const summary = [
  { label: "Opening", value: money(2450), tone: "" },
  { label: "Credit", value: money(3200), tone: "text-success" },
  { label: "Debit", value: money(1865.4), tone: "text-destructive" },
  { label: "Closing", value: money(3784.6), tone: "accent" },
];

const rows = [
  { date: "Sep 1, 2026", desc: "Salary", cat: "Income", credit: 3200, debit: 0, balance: 5650 },
  { date: "Sep 3, 2026", desc: "Rent", cat: "Housing", credit: 0, debit: 1200, balance: 4450 },
]

const StatementPreview = () => (
<ScrollReveal fromScale={0.96} fromOpacity={0.3} fromY={24}>
  <div
    role="img"
    aria-label="Sample Trackwise transaction statement showing opening and closing balances and transactions"
    className="overflow-hidden rounded-xl border border-border bg-card p-5 text-[11px] text-card-foreground shadow-2xl shadow-primary/10 sm:p-7"
  >
    <div className="flex items-end justify-between border-b-2 border-primary pb-3">
      <div>
        <p className="text-xl font-bold text-primary">Trackwise</p>
        <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">
          Transaction statement
        </p>
      </div>
      <p className="hidden text-[9px] text-muted-foreground sm:block">
        Generated on Sep 30, 2026 9:00 AM
      </p>
    </div>

    <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 rounded-md bg-muted px-3 py-2.5">
      <div>
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        <p className="mt-0.5 text-xs font-bold">Main Checking</p>
      </div>
      <div className="text-right">
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
          Statement period
        </p>
        <p className="mt-0.5 text-xs font-bold">Sep 1, 2026 – Sep 30, 2026</p>
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
      <div className="min-w-[440px]">
        <div className="grid grid-cols-[16fr_38fr_15fr_15fr_16fr] rounded-sm bg-primary px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
          <span>Date</span>
          <span>Description</span>
          <span className="text-right">Credit</span>
          <span className="text-right">Debit</span>
          <span className="text-right">Balance</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.date}
            className={`grid grid-cols-[16fr_38fr_15fr_15fr_16fr] items-center border-b border-border/60 px-2 py-1.5 ${
              i % 2 === 1 ? "bg-muted/50" : ""
            }`}
          >
            <span>{r.date}</span>
            <span className="pr-2">
              {r.desc}
              <span className="block text-[8px] text-muted-foreground">
                {r.cat}
              </span>
            </span>
            <span className="text-right text-success">
              {r.credit > 0 ? money(r.credit) : "—"}
            </span>
            <span className="text-right text-destructive">
              {r.debit > 0 ? money(r.debit) : "—"}
            </span>
            <span className="text-right font-bold">{money(r.balance)}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-2 text-[8px] text-muted-foreground">
      <span>Generated automatically by Trackwise · Main Checking</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
  </ScrollReveal>
);

export default StatementPreview;
