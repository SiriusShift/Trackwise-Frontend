import { Check } from "lucide-react";
import StatementPreview from "./StatementPreview";

const points = [
  "Opening and closing balance for the period",
  "Every credit and debit, with descriptions",
  "Per-account statements, generated in seconds",
  "Ready to print, file, or share",
];

const StatementsSection = () => (
  <section
    id="statements"
    className="scroll-mt-16 border-b border-border/60 bg-card/30 py-20 lg:py-24"
  >
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
      <StatementPreview />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Statements you can download
        </h2>
        <p className="mt-3 text-muted-foreground">
          Pick an account and a date range, and get a clean PDF statement of
          everything that moved in and out.
        </p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default StatementsSection;
