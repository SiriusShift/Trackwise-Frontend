import { Input } from "@/components/ui/input";
import LayoutAuth from "@/components/authentication/LayoutAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePostForgotPasswordMutation } from "@/feature/authentication/api/signinApi";
import { useState } from "react";
import { toast, Toaster } from "sonner";
const ForgotPassword = () => {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [postForgotPassword] = usePostForgotPasswordMutation();

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await postForgotPassword([email]).unwrap();
      toast.success("Password reset link sent to your email");
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
        title="Forgot Password"
        desc="Enter your email address and we will send you a password reset link."
        submit={onSubmit}
      >
        <div className="mt-5 w-full gap-5 flex-col flex">
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="gap-3 flex flex-col items-center mt-3">
            <Button type="submit" className="w-full sm:w-96" disabled={!email}>
              Submit
            </Button>
            <a className="text-gray-600" onClick={() => router("/sign-in")}>
              Return to Sign In
            </a>
          </div>
        </div>
      </LayoutAuth>
      <Toaster />
    </>
  );
};

export default ForgotPassword;
