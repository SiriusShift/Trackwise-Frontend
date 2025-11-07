import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";
import { useSelector } from "react-redux";
import moment from "moment";
import { TrendingDown, TrendingUp, ArrowRightLeft } from "lucide-react";
import { DateRange } from "react-day-picker";
import { IRootState } from "@/app/store";
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
  return String(text).charAt(0).toUpperCase() + String(text).slice(1)
}

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

export const formatCurrency = (amount) => {
  const currency = useSelector((state: IRootState) => state.settings.currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const numberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any
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
    saltkey
  ).toString();
  return ciphertext;
};

//Error Handling
export const handleCatchErrorMessage = (error: any) => {
  if (error?.data?.error?.message) {
    return error?.data?.error?.message;
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
