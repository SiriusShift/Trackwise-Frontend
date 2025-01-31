import { useMemo } from "react";
import * as Icons from "lucide-react";

const categoryIcons = {
  Food: "CookingPot",
  Transport: "BusFront",
  Shopping: "ShoppingCart",
  Entertainment: "Music",
  Bills: "CreditCard",
};

const useLucideIcon = (categoryName) => {
  return useMemo(() => {
    return Icons[categoryIcons[categoryName]] || Icons["Circle"]; // Default to "Circle"
  }, [categoryName]);
};

export default useLucideIcon;
