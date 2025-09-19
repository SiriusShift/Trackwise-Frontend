import { Input } from "@/shared/components/ui/input";
import LayoutAuth from "@/layout/AuthLayout";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  usePostForgotPasswordMutation,
  usePostResetPasswordMutation,
} from "@/features/auth/api/signinApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../schema/authSchema";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const router = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [postForgotPassword] = usePostForgotPasswordMutation();
  const [resetTrigger] = usePostResetPasswordMutation();

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

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(320); // Start 5-minute countdown
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await postForgotPassword([email]).unwrap();
      toast.success("Password reset link sent to your email");
      if (step === "email") {
        setStep("reset");
      }
      startResendTimer();
    } catch (err) {
      console.log(err)
      let errorMessage = "An error occurred"; // Default message
      if (err && (err as { data?: { message?: string } }).data) {
        errorMessage =
          (err as { data: { message: string } }).data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await resetTrigger({
        // id: parseInt(id || ""),
        token: watch("code"),
        password: watch("password"),
      }).unwrap();
      toast.success("Password reset successful");
      setTimeout(() => {
        router("/sign-in");
      }, 3000);
    } catch (err) {
      console.log(err)
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
      {step === "email" ? (
        <LayoutAuth
          title="Forgot Password"
          desc="Enter your email address and we will send you a password reset link."
          submit={handleSubmit}
        >
          <div className="mt-5 w-full gap-5 flex-col flex">
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="gap-3 flex flex-col items-center mt-3">
              <Button
                type="submit"
                className="w-full sm:w-96"
                disabled={!email}
              >
                Submit
              </Button>
              <a className="text-gray-600" onClick={() => router("/sign-in")}>
                Return to Sign In
              </a>
            </div>
          </div>
        </LayoutAuth>
      ) : (
        <LayoutAuth
          title="Reset Password"
          desc="Enter your new password and confirm it"
          submit={onSubmit}
        >
          <div className="mt-5 w-full gap-5 flex-col flex">
            <div>
              <Input placeholder="Code" {...register("code")} />
            </div>
            <div>
              <Input placeholder="Password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
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
              <span>
                Didn't receive the email?{" "}
                <a
                  href="#"
                  onClick={resendTimer > 0 ? undefined : () => handleSubmit}
                  className={`font-bold underline ${
                    resendTimer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {resendTimer > 0
                    ? `${resendTimer} seconds left`
                    : "Resend Code"}
                </a>
              </span>
            </div>
          </div>
        </LayoutAuth>
      )}
    </>
  );
};

export default ForgotPassword;
