import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  LucideIcon,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { QuickActions, useQuickActions } from "./QuickActionsProvider";

type QuickAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  run: (actions: QuickActions) => void;
};

const ACTIONS: QuickAction[] = [
  // { id: "chat", label: "Chat", icon: MessageCircle, run: (a) => a.openChat() },
  {
    id: "transfer",
    label: "Transfer",
    icon: ArrowLeftRight,
    run: (a) => a.openAdd("Transfer"),
  },
  {
    id: "income",
    label: "Income",
    icon: ArrowDownLeft,
    run: (a) => a.openAdd("Income"),
  },
  {
    id: "expense",
    label: "Expense",
    icon: ArrowUpRight,
    run: (a) => a.openAdd("Expense"),
  },
];

export function QuickActionFab({ hidden }: { hidden: boolean }) {
  const actions = useQuickActions();
  const [open, setOpen] = useState(false);
  if (hidden) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-[1px] sm:hidden"
        />
      )}
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          aria-label={open ? "Close quick actions" : "Quick actions"}
          data-tour="add"
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 h-14 w-14 rounded-2xl shadow-lg [&_svg]:size-6"
        >
          <Plus
            className={cn(
              "transition-transform duration-200",
              open && "rotate-45",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        className="z-50 border-0 bg-transparent p-0 shadow-none flex flex-col items-end gap-3"
      >
        {ACTIONS.map(({ id, label, icon: Icon, run }) => (
          <DropdownMenuItem
            key={id}
            onSelect={() => run(actions)}
            className="group gap-3 bg-transparent p-0 pr-1 py-1 focus:bg-transparent"
          >
            <span className="rounded-md border border-border bg-popover px-2.5 py-1 text-sm font-semibold text-popover-foreground shadow-md">
              {label}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-popover text-popover-foreground shadow-lg transition-colors group-hover:bg-accent group-focus:bg-accent group-focus:ring-2 group-focus:ring-ring">
              <Icon className="h-5 w-5" />
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
