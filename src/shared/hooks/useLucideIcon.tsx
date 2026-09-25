import { useMemo } from "react";
import * as Icons from "lucide-react";
import { getLucideIcon } from "@/shared/utils/icons";

const categoryIcons: Record<string, string> = {
  Food: "CookingPot",
  Transport: "BusFront",
  Shopping: "ShoppingCart",
  Entertainment: "Music",
  Bills: "CreditCard",
};

const useLucideIcon = (categoryName: string) => {
  return useMemo(() => {
    return getLucideIcon(categoryIcons[categoryName], Icons.Circle); // Default to "Circle"
  }, [categoryName]);
};

export default useLucideIcon;
