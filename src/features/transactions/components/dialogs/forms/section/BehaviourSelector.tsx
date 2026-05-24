import { Bell, Zap } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { cn } from "@/lib/utils";

type Behaviour = "AUTO_LOG" | "REMIND";

const OPTIONS = [
  {
    value: "AUTO_LOG" as Behaviour,
    label: "Auto-log",
    description: "Automatically create and log the transaction on the due date.",
    icon: Zap,
  },
  {
    value: "REMIND" as Behaviour,
    label: "Reminder only",
    description: "Send a reminder to confirm before logging.",
    icon: Bell,
  },
];

export const BehaviourSelector = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="behaviour"
    render={({ field: { onChange, value } }) => (
      <FormItem>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Behaviour when due</p>
            <p className="text-xs text-muted-foreground">
              Choose what happens automatically once the due date is reached.
            </p>
          </div>
          <FormControl>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {OPTIONS.map(({ value: opt, label, description, icon: Icon }) => {
                const selected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200",
                      selected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 flex h-9 w-9 items-center justify-center rounded-lg",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground mt-1">
                      {description}
                    </p>
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    )}
  />
);