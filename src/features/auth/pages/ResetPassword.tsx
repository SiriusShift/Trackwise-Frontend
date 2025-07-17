import { Input } from "@/shared/components/ui/input";
import LayoutAuth from "@/layout/AuthLayout";
import { Button } from "@/shared/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { usePostResetPasswordMutation } from "@/features/auth/api/signinApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../schema/authSchema";
const ResetPassword = () => {
  const router = useNavigate();
  const location = useLocation();
  const [resetTrigger] = usePostResetPasswordMutation(); 

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const id = queryParams.get('id');
  const {
    register,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema.schema),
    mode: "onChange",
  });
  console.log(watch());


  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("hello");
    event.preventDefault();
    try {
        await resetTrigger({
            id: parseInt(id || ""),
            token: token,
            password: watch("password"),
        }).unwrap();
        toast.success("Password reset successful");
        setTimeout(() => {
          router("/sign-in");
        }, 3000);
    } catch (err) {
      let errorMessage = "An error occurred"; // Default message
      if (err && (err as { data?: { message?: string } }).data) {
        errorMessage =
          (err as { data: { message: string } }).data.message || errorMessage; // Extract the message or use default
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <LayoutAuth
        title="Reset Password"
        desc="Enter your new password and confirm it"
        submit={onSubmit}
      >
        <div className="mt-5 w-full gap-5 flex-col flex">
          <div>
            <Input
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Confirm Password"
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <div className="gap-3 flex flex-col items-center mt-3">
            <Button
              type="submit"
              className="w-full sm:w-96"
              disabled={!isValid}
            >
              Reset
            </Button>
            <a className="text-gray-600" onClick={() => router("/sign-in")}>
              Return to Sign In
            </a>
          </div>
        </div>
      </LayoutAuth>
    </>
  );
};

export default ResetPassword;
