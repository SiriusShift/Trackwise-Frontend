import { commonDialogProps } from "@/shared/types";
import z from "zod";
import { ACCOUNT_SUBTYPES } from "../constants";
import { accountSchema } from "../schema/account.schema";

export type AccountFormValues = z.infer<typeof accountSchema>;

export interface AccountData extends AccountFormValues {
  id: string;
}

export interface AccountDialogProps extends commonDialogProps {
  mode: string;
  account?: AccountData;
}

export type AccountCategory = keyof typeof ACCOUNT_SUBTYPES | "CASH";
