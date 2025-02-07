import { Input } from "@/components/ui/input";
import LayoutAuth from "@/components/authentication/LayoutAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePostForgotPasswordMutation } from "@/feature/authentication/api/signinApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

const ForgotPassword = () => {
  const router = useNavigate();
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState("");
  const [reset, setReset] = useState(false);
  const [postForgotPassword] = usePostForgotPasswordMutation();

  console.log(timer);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await postForgotPassword([email]).unwrap();
      toast.success("Password reset link sent to your email");
      setReset(true);
    } catch (err) {
      let errorMessage = "An error occurred"; // Default message
      if (err && (err as { data?: { message?: string } }).data) {
        errorMessage =
          (err as { data: { message: string } }).data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleResend = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await postForgotPassword([email]).unwrap();
      toast.success("Password reset link resent to your email");
    } catch (err) {
      let errorMessage = "An error occurred while resending the email";
      if (err && (err as { data?: { message?: string } }).data) {
        errorMessage =
          (err as { data: { message: string } }).data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      {!reset ? (
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
          title="Email sent!"
          icon={MailCheck} // ✅ Ensure correct prop reference
          submit={handleSubmit}
          desc={`We've sent a password reset link to ${email}. Check your inbox and spam folder.`}
        >
          <div className="flex justify-center flex-col items-center">
            <span>
              Didn't receive the email?{" "}
              <a
                href="#"
                onClick={handleResend}
                className="font-bold underline"
              >
                Resend Email
              </a>
            </span>
          </div>
        </LayoutAuth>
      )}
    </>
  );
};

export default ForgotPassword;
