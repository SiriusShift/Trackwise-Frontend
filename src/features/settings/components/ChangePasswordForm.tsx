import { IRootState } from "@/app/store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { setHasPassword } from "@/shared/slices/userSlice";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../api/settingsApi";
import { changePasswordSchema } from "../schema/settings.schema";
import { ChangePasswordFormValues } from "../types/settings.types";

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordForm = () => {
  const hasPassword = useSelector(
    (state: IRootState) => state.userDetails.hasPassword,
  );
  const dispatch = useDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues,
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    if (hasPassword && !values.currentPassword) {
      setError("currentPassword", { message: "Current password is required" });
      return;
    }

    try {
      const res = await changePassword({
        currentPassword: hasPassword ? values.currentPassword : undefined,
        newPassword: values.newPassword,
      }).unwrap();
      dispatch(setHasPassword(true));
      reset(defaultValues);
      toast.success(res.message);
    } catch (err) {
      toast.error(handleCatchErrorMessage(err));
    }
  };

  return (
    <form
      data-tour="change-password"
      className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <p className="text-sm font-medium">
          {hasPassword ? "Change password" : "Set password"}
        </p>
        <p className="text-muted-foreground text-sm">
          {hasPassword
            ? "Enter your current password to choose a new one."
            : "Your account has no password yet. Set one to sign in without Google."}
        </p>
      </div>

      <div className="col-span-1 sm:col-span-3 flex flex-col gap-4">
        {hasPassword && (
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!isValid || isLoading}
          >
            {isLoading
              ? "Saving..."
              : hasPassword
                ? "Change password"
                : "Set password"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
