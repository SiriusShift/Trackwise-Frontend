import { Check } from "lucide-react";
import ScreenshotPlaceholder from "./ScreenshotPlaceholder";

const points = [
  "Monthly statements with charges and payments in one view",
  "Minimum payment tracking with a floor you set",
  "Due dates added to your calendar automatically",
  "Installment and loan payments tracked alongside your cards",
];

const CreditCardSection = () => (
  <section
    id="credit-cards"
    className="scroll-mt-16 border-b border-border/60 bg-card/30 py-20 lg:py-24"
  >
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
      <ScreenshotPlaceholder
        label="Credit statement screenshot"
        hint="Replace with a capture of a monthly statement and its payments"
        className="order-last lg:order-first"
      />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Credit card billing, month by month
        </h2>
        <p className="mt-3 text-muted-foreground">
          Track each statement cycle from start to finish, so you always know what
          is due and what you have paid.
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

export default CreditCardSection;
