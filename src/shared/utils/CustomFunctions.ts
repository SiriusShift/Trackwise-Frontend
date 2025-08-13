import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";
import { useSelector } from "react-redux";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { IRootState } from "@/app/store";
export const formatDate = (month: number, day: string, year: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthWord = months[month];

  return `${monthWord} ${day}, ${year}`;
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

export const numberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any
) => {
  let value = e.target.value;
  console.log(value);

  // Allow empty string for controlled input behavior
  if (value === "") {
    field.onChange(null); // don't set 0 yet
    return;
  }

  // Remove leading zeros, except for decimals like "0.1"
  if (/^-?0+\d/.test(value) && value.length > 1 && value[1] !== ".") {
    value = value.replace(/^(-?)0+/, "$1");
    console.log(value);
  }

  // ✅ Allow negative numbers and up to 2 decimal places
  if (/^-?\d*\.?\d{0,2}$/.test(value)) {
    field.onChange(Number(value));
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
