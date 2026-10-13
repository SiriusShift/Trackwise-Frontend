import { commonDialogProps } from "@/shared/types";
import z from "zod";
import { changePasswordSchema, profileSchema } from "../schema/settings.schema";

export interface CategoryDialogProps extends commonDialogProps {
  mode: string;
}

export type ProfileSettingsFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
