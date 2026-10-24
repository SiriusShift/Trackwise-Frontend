// Themed HTML mock of the PDF in features/transactions/components/reports/CreditCardStatement.tsx.
// Sample data only, trimmed to the summary and a short transactions table; keep the layout in sync with the PDF.
import { formatCurrency } from "@/shared/utils/CustomFunctions";

const money = (n: number) => formatCurrency(n);

const summaryLines = [
  { label: "Purchases & charges", value: money(1126.4) },
  { label: "Installments billed", value: money(120) },
  { label: "Statement balance", value: money(1246.4), total: true },
  { label: "Interest charged", value: money(24.5) },
  { label: "Total amount due", value: money(1270.9), total: true },
];

const transactions = [
  { date: "Sep 4", desc: "Groceries", sub: "Food", type: "Purchase", amount: 186.4 },
  { date: "Sep 9", desc: "Phone", sub: "5 of 12", type: "Installment", amount: 120 },
  { date: "Sep 15", desc: "Flight tickets", sub: "Travel", type: "Purchase", amount: 940 },];

const cols = "grid-cols-[14fr_46fr_18fr_22fr]";

const SummaryLine = ({
  label,
  value,
  total,
}: {
  label: string;
  value: string;
  total?: boolean;
}) => (
  <div
    className={`flex justify-between py-0.75 ${
      total ? "mt-0.75 border-t border-foreground pt-1.25 font-bold" : ""
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const CreditStatementPreview = () => (
    <div
      role="img"
      aria-label="Sample Trackwise credit card statement showing the account summary, total amount due and this cycle's transactions"
      className="overflow-hidden rounded-xl border border-border bg-card p-4 text-[11px] text-card-foreground shadow-2xl shadow-primary/10 sm:p-5"
    >
      <div className="flex items-end justify-between border-b-2 border-primary pb-3">
        <div>
          <p className="text-xl font-bold text-primary">Trackwise</p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">
            Credit card statement
          </p>
        </div>
        <p className="hidden text-[9px] text-muted-foreground sm:block">
          Generated on Sep 30, 2026 9:00 AM
        </p>
      </div>

      <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-2 rounded-md bg-muted px-3 py-2.5">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Card
          </p>
          <p className="mt-0.5 text-xs font-bold">Visa Platinum</p>
          <p className="text-[8px] text-muted-foreground">First National</p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Statement period
          </p>
          <p className="mt-0.5 text-xs font-bold">Sep 1 – Sep 30, 2026</p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <p className="mt-0.5 text-xs font-bold">Partially paid</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-5">
        <div className="rounded-md border border-border px-3 py-2 sm:col-span-3">
          <p className="mb-1 mt-1 text-[8px] uppercase tracking-wider text-muted-foreground">
            Account summary
          </p>
          {summaryLines.map((line) => (
            <SummaryLine key={line.label} {...line} />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="rounded-md bg-primary px-3 py-3 text-primary-foreground">
            <p className="mb-1 text-[8px] uppercase tracking-wider text-primary-foreground/80">
              Total amount due
            </p>
            <p className="text-base font-bold">{money(1270.9)}</p>
            <p className="mt-1 text-[9px] text-primary-foreground/80">
              Due Oct 25, 2026
            </p>
          </div>
          <div className="rounded-md border border-border px-3 py-1.5">
            <SummaryLine label="Paid since statement" value={money(600)} />
            <SummaryLine label="Remaining due" value={money(670.9)} />
          </div>
        </div>
      </div>

      <p className="mb-1.5 mt-3 text-[10px] font-bold">Transactions</p>
      <div className="overflow-x-auto">
        <div className="min-w-95">
          <div
            className={`grid ${cols} rounded-sm bg-primary px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground`}
          >
            <span>Date</span>
            <span>Description</span>
            <span>Type</span>
            <span className="text-right">Amount</span>
          </div>
          {transactions.map((t, i) => (
            <div
              key={t.desc}
              className={`grid ${cols} items-center border-b border-border/60 px-2 py-1.5 ${
                i % 2 === 1 ? "bg-muted/50" : ""
              }`}
            >
              <span>{t.date}</span>
              <span className="pr-2">
                {t.desc}
                <span className="block text-[8px] text-muted-foreground">
                  {t.sub}
                </span>
              </span>
              <span className="text-muted-foreground">{t.type}</span>
              <span className="text-right">{money(t.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-2 text-[8px] text-muted-foreground">
        <span>Generated automatically by Trackwise · Visa Platinum</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
);

export default CreditStatementPreview;
