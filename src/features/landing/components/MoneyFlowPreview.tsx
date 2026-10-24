// Themed HTML mock of the PDF in features/transactions/components/reports/MoneyFlowStatement.tsx.
// Sample data only; keep the layout in sync with the PDF.
import { formatCurrency } from "@/shared/utils/CustomFunctions";

const money = (n: number) => formatCurrency(n);

const summary = [
  { label: "Opening", value: money(4820), tone: "" },
  { label: "Money in", value: money(3200), tone: "text-success" },
  { label: "Money out", value: money(2140.6), tone: "text-destructive" },
  { label: "Closing", value: money(5879.4), tone: "accent" },
];

const rows = [
  { date: "Sep 1", desc: "Salary", type: "Income", from: "—", to: "Main Checking", change: 3200, balance: 8020 },
  { date: "Sep 3", desc: "Rent", type: "Expense", from: "Main Checking", to: "—", change: -1200, balance: 6820 },
  { date: "Sep 10", desc: "Card payment", type: "Transfer", from: "Main Checking", to: "Visa Platinum", change: -600, balance: 6220 },
  { date: "Sep 14", desc: "Groceries", type: "Expense", from: "Cash", to: "—", change: -340.6, balance: 5879.4 },];

const cols = "grid-cols-[12fr_22fr_14fr_14fr_12fr_12fr_14fr]";

const MoneyFlowPreview = () => (
  <div
    role="img"
    aria-label="Sample Trackwise money flow report showing money in and out across cash and bank accounts"
    className="overflow-hidden rounded-xl border border-border bg-card p-4 text-[11px] text-card-foreground shadow-2xl shadow-primary/10 sm:p-5"
  >
    <div className="flex items-end justify-between border-b-2 border-primary pb-3">
      <div>
        <p className="text-xl font-bold text-primary">Trackwise</p>
        <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">
          Money flow report
        </p>
      </div>
      <p className="hidden text-[9px] text-muted-foreground sm:block">
        Generated on Sep 30, 2026 9:00 AM
      </p>
    </div>

    <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-2 rounded-md bg-muted px-3 py-2.5">
      <div>
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
          Scope
        </p>
        <p className="mt-0.5 text-xs font-bold">Cash &amp; bank accounts</p>
      </div>
      <div className="text-right">
        <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
          Report period
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

    <div className="mt-3 overflow-x-auto">
      <div className="min-w-130">
        <div
          className={`grid ${cols} rounded-sm bg-primary px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground`}
        >
          <span>Date</span>
          <span>Description</span>
          <span>Source</span>
          <span>Destination</span>
          <span className="text-right">In</span>
          <span className="text-right">Out</span>
          <span className="text-right">Total</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.date}
            className={`grid ${cols} items-center border-b border-border/60 px-2 py-1.5 ${
              i % 2 === 1 ? "bg-muted/50" : ""
            }`}
          >
            <span>{r.date}</span>
            <span className="pr-2">
              {r.desc}
              <span className="block text-[8px] text-muted-foreground">
                {r.type}
              </span>
            </span>
            <span className="pr-2">{r.from}</span>
            <span className="pr-2">{r.to}</span>
            <span className="text-right text-success">
              {r.change > 0 ? money(r.change) : "—"}
            </span>
            <span className="text-right text-destructive">
              {r.change < 0 ? money(-r.change) : "—"}
            </span>
            <span className="text-right font-bold">{money(r.balance)}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-2 text-[8px] text-muted-foreground">
      <span>Generated automatically by Trackwise · Money flow</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
);

export default MoneyFlowPreview;
