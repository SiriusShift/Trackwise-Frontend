import { IRootState } from "@/app/store";
import { TransactionDialog } from "@/features/transactions/components/dialogs/TransactionDialog";
import { TransactionType } from "@/features/transactions/components/hooks/UseTransactionSubmit";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { QuickActionFab } from "./QuickActionsFab";

export type OpenAddOptions = {
  /** Open the form with Repeat already on (schedule fields showing) */
  recurring?: boolean;
};

export type QuickActions = {
  openAdd: (type?: TransactionType, options?: OpenAddOptions) => void;
  //   openChat: () => void;
};

const Ctx = createContext<QuickActions | null>(null);

export function QuickActionsProvider({ children }: { children: ReactNode }) {
  const pageType = useSelector(
    (s: IRootState) => s.active.type,
  ) as TransactionType;
  const [add, setAdd] = useState<{
    open: boolean;
    type: TransactionType;
    recurring: boolean;
  }>({
    open: false,
    type: "Expense",
    recurring: false,
  });

  const openAdd = useCallback(
    (type?: TransactionType, options?: OpenAddOptions) =>
      setAdd({
        open: true,
        type: type ?? pageType,
        recurring: !!options?.recurring,
      }),
    [pageType],
  );

  const value = useMemo(() => ({ openAdd }), [openAdd]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <QuickActionFab hidden={add.open} />
      <TransactionDialog
        key={`${add.type}-${add.recurring}`}
        mode="add"
        type={add.type}
        startRecurring={add.recurring}
        open={add.open}
        setOpen={(open) => setAdd((s) => ({ ...s, open }))}
      />
    </Ctx.Provider>
  );
}
export function useQuickActions() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useQuickActions must be used inside QuickActionsProvider");
  return ctx;
}
