// Themed mock of the in-app credit statement view in
// shared/components/dialog/ScheduleDialog/CreditStatementDetails.tsx.
// Sample data only; keep the layout in sync with the dialog.
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { InfoRow } from "@/shared/components/dialog/ViewDialog/InfoRow";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import {
  CalendarCheck,
  Calendar1,
  CircleCheck,
  CreditCard,
  FileText,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const money = (n: number) => formatCurrency(n);

const details = [
  { icon: Calendar1, label: "Due Date", value: "October 25, 2026" },
  { icon: FileText, label: "Statement Date", value: "September 30, 2026" },
  { icon: Receipt, label: "Statement Balance", value: money(1270.9) },
  { icon: CircleCheck, label: "Paid So Far", value: money(600) },
  { icon: Wallet, label: "Current Card Balance", value: money(1018.6) },
];

const CreditCardDetailsPreview = () => (
  <ScrollReveal fromScale={0.96} fromOpacity={0.3} fromY={24}>
    <div
      role="img"
      aria-label="Sample Trackwise credit card statement view showing the remaining amount due, due date, an installment and a payment"
      className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl shadow-primary/10"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Credit statement</p>
        <X className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="rounded-2xl border p-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-center">
            <span className="block text-3xl font-bold">{money(670.9)}</span>
            <p className="text-sm text-muted-foreground">Visa Platinum</p>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Partially paid
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {details.map((d, i) => (
            <div key={d.label} className="flex flex-col gap-3">
              {i > 0 && <Separator />}
              <InfoRow icon={d.icon} label={d.label} value={d.value} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 pt-0">
        <h3 className="mb-3 text-sm font-bold">Installments</h3>
        <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Phone</p>
            <p className="text-xs text-muted-foreground">5 of 12</p>
          </div>
          <p className="text-sm font-medium tabular-nums">{money(120)}</p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <h3 className="mb-3 text-sm font-bold">Payments</h3>
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm">October 02, 2026</p>
              <p className="text-xs font-medium text-muted-foreground">
                From Main Checking
              </p>
            </div>
          </div>
          <p className="font-medium">{money(600)}</p>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-border p-3">
        <span className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
          Pay
        </span>
      </div>
    </div>
  </ScrollReveal>
);

export default CreditCardDetailsPreview;
