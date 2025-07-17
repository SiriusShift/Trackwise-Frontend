import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";
import { useSelector } from "react-redux";
import moment from "moment";
import { DateRange } from "react-day-picker";
import { RootState } from "@reduxjs/toolkit/query";

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
  const active = useSelector((state: RootState) => state.active.active);
  const mode = useSelector((state: RootState) => state.active.mode);
  if (!active) return "Select Date";

  if (mode === "daily") {
    return moment(active as string).format("MMMM D, YYYY");
  } else if (mode === "weekly") {
    const range = active as DateRange;
    return `${moment(range.from).format("MMM D")} - ${moment(range.to).format(
      "MMM D, YYYY"
    )}`;
  } else if (mode === "monthly") {
    return moment(active as string).format("MMMM YYYY");
  } else if (mode === "yearly") {
    return moment(active as string).format("YYYY");
  }

  return "Select Date";
};

export const formatMode = () => {
  const mode = useSelector((state: RootState) => state.active.mode);
  if (mode === "daily") return "day";
  if (mode === "weekly") return "week";
  if (mode === "monthly") return "month";
  if (mode === "yearly") return "year";
}

export const numberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any
) => {
  let value = e.target.value;

  // Log for debugging
  console.log(field, value);

  if (value === "") {
    value = "0";
  }

  // Remove leading zeros, except if it's a "0." for decimal values
  else if (/^0+/.test(value) && value.length > 1 && value[1] !== ".") {
    value = value.replace(/^0+/, ""); // Remove leading zeros
  }

  // Validate and allow only up to 2 decimal places
  if (/^\d*\.?\d{0,2}$/.test(value)) {
    // Ensure the value is correctly formatted and set it
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
