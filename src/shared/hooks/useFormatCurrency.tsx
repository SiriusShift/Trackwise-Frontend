// ✅ Custom Hook Pattern
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/CustomFunctions";

export default function useFormatCurrency() {
  return ({
    value,
  }: {
    value: number;
  }) => {
    const remainingDisplay = formatCurrency(value);

    return remainingDisplay;
  };
}
