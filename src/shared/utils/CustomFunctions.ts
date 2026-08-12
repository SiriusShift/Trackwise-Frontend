import { IRootState } from "@/app/store";
import CryptoJS from "crypto-js";
import moment from "moment";
import { useSelector } from "react-redux";
import { saltkey } from "./saltkey";
export const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CapitalCase = (text: string) => {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
};

export const formatString = (str: string) => {
  if (str.length <= 24) return str;
  return str.slice(0, 19).concat("...");
};

export const formatDateDisplay = (): string => {
  const active = useSelector((state: IRootState) => state.active.active);
  console.log(active);
  const mode = useSelector((state: IRootState) => state.active.mode);
  if (!active) return "Select Date";

  if (mode === "monthly") {
    return moment(active?.to as string).format("MMMM YYYY");
  } else if (mode === "yearly") {
    return moment(active?.to as string).format("YYYY");
  }

  return "Select Date";
};

export const formatMode = () => {
  const mode = useSelector((state: IRootState) => state.active.mode);
  if (mode === "daily") return "day";
  if (mode === "weekly") return "week";
  if (mode === "monthly") return "month";
  if (mode === "yearly") return "year";
};

export const formatCurrency = (
  amount: number,
  currency = "PHP",
  currencyDisplay: Intl.NumberFormatOptions["currencyDisplay"] = "symbol",
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay,
  }).format(amount);
};

export const numberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any,
) => {
  let value = e.target.value;

  // Allow empty string
  if (value === "") {
    field.onChange("");
    return;
  }

  // Remove leading zeros (but keep "0." valid)
  if (/^-?0+\d/.test(value) && value[1] !== ".") {
    value = value.replace(/^(-?)0+/, "$1");
  }

  // Allow up to 2 decimals
  if (/^-?\d*\.?\d{0,2}$/.test(value)) {
    field.onChange(value); // store as string
  }
};

export const decryptString = (data: any) => {
  if (!data) return null;

  const bytes = CryptoJS.AES.decrypt(data, saltkey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const encryptString = (data: any) => {
  if (!data) return null;
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    saltkey,
  ).toString();
  return ciphertext;
};

//Error Handling
export const handleCatchErrorMessage = (error) => {
  console.log(error);
  if (error?.data?.error?.message) {
    return error?.data?.error?.message;
  } else if (error?.data?.error) {
    return error?.data?.error;
  } else if (error?.data?.message) {
    return error?.data?.message;
  } else if (error?.status === 400) {
    return "Something went wrong with your request.";
  } else if (error?.status === 401) {
    return "Authentication required.";
  } else if (error?.status === 403) {
    return "You don't have permission for this.";
  } else if (error?.status === 404) {
    return "The requested resource couldn't be found.";
  } else if (error?.status === 500) {
    return "Something unexpected happened on our end.";
  } else {
    return "An unexpected error occurred";
  }
};

export const getStatus = (date) => {
  const today = moment();
  const due = moment(date);
  if (due.isBefore(today, "day"))
    return {
      label: "Overdue",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/40",
      dot: "bg-red-500",
      border: "border-red-200 dark:border-red-900",
    };
  if (due.isSame(today, "day"))
    return {
      label: "Due Today",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      dot: "bg-amber-400",
      border: "border-amber-200 dark:border-amber-900",
    };
  if (due.diff(today, "day") <= 7)
    return {
      label: "Due Soon",
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/40",
      dot: "bg-orange-400",
      border: "border-orange-200 dark:border-orange-900",
    };
  return {
    label: "Upcoming",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    dot: "bg-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900",
  };
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
