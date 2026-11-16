import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

// Toggle chip used by the filter sheet sections
const FilterChip = ({
  selected,
  onToggle,
  children,
  icon,
}: {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={cn(
      "inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border px-3 text-sm font-medium capitalize transition-colors",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      selected
        ? "border-primary bg-primary/10 text-primary"
        : "border-input bg-background text-foreground hover:bg-muted",
    )}
  >
    {selected ? <Check className="h-3.5 w-3.5 shrink-0" /> : icon}
    <span className="truncate">{children}</span>
  </button>
);

export default FilterChip;
