import CryptoJS from "crypto-js";
import { saltkey } from "./saltkey";

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


export const numberInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
  let value = e.target.value;

  // Log for debugging
  console.log(field, value);

  // Remove leading zeros, except if it's a "0." for decimal values
  if (/^0+/.test(value) && value.length > 1 && value[1] !== '.') {
    value = value.replace(/^0+/, '');  // Remove leading zeros
  }

  // Validate and allow only up to 2 decimal places
  if (/^\d*\.?\d{0,2}$/.test(value)) {
    // Ensure the value is correctly formatted and set it
    field.onChange(value);
  }
}


export const decryptString = (data: string) => {
  if (!data) return null;

  const bytes = CryptoJS.AES.decrypt(data, saltkey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const encryptString = (data: string) => {
  if (!data) return null;
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    saltkey
  ).toString();
  return ciphertext;
} 

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