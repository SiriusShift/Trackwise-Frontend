// app/components/SignUpForm.tsx
"use client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { yupResolver } from "@hookform/resolvers/yup";
// import Logo from "../assets/images/Logo.svg";
import Google from "../assets/images/Google.svg";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema } from "../schema/schema";
import { encryptString } from "../utils/CustomFunctions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { setSignup } from "../feature/authentication/reducers/signupSlice";
import {
  usePostVerifyMutation,
  usePostSignupMutation,
} from "../feature/authentication/api/signupApi";
import LayoutAuth from "../components/authentication/LayoutAuth";
interface FormData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

const signUp = () => {
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [code, setCode] = useState("");
  // const device = encryptString(getBrowserInfo());
  const router = useNavigate();
  const dispatch = useDispatch();

  const [postVerify, { isLoading }] = usePostVerifyMutation();
  const [postSignup, { isLoading: postSignupLoading }] =
    usePostSignupMutation();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(signupSchema.schema),
    mode: "onChange",
    defaultValues: signupSchema.defaultValues,
  });

  const submitSignup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const encryptedPassword = encryptString(getValues("password"));
    try {
      const response = await postSignup({
        firstName: getValues("firstName"),
        lastName: getValues("lastName"),
        username: getValues("username"),
        email: getValues("email"),
        password: encryptedPassword || "",
        otp: code || "",
      }).unwrap();
      console.log(response);
      router("/");
    } catch (err) {
      let errorMessage = "An error occurred"; // Default message
      if (err && (err as { data?: { message?: string } }).data) {
        errorMessage =
          (err as { data: { message: string } }).data.message || errorMessage; // Extract the message or use default
      }
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isValid) {
      try {
        const response = await postVerify({
          email: [watch("email")] as Array<string>,
          username: watch("username"),
        }).unwrap();
        console.log(response);
        resendCode();
        setIsVerifying(true);
      } catch (err) {
        let errorMessage = "An error occurred"; // Default message
        if (err && (err as { data?: { message?: string } }).data) {
          errorMessage =
            (err as { data: { message: string } }).data.message || errorMessage; // Extract the message or use default
        }
        toast.error(errorMessage);
      }
    } else {
      console.log(errors);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google/sign-up'; // Redirect to backend OAuth route
  };

  const resendCode = () => {
    setCountdown(60); // 1 minute countdown
  };

  useEffect(() => {
    // If countdown is greater than 0, start the countdown
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear the interval when countdown reaches 0
      return () => clearInterval(timer);
    } else {
      // Re-enable the button when countdown reaches 0
      setIsDisabled(false);
    }
  }, [countdown]);

  return (
    <>
      <LayoutAuth
        submit={onSubmit}
        title={!isVerifying ? "Signup to Trackwise" : "Verify your email"}
        desc={
          !isVerifying
            ? "Let's get started to track your expenses"
            : `An email is sent to ${watch("email")}`
        }
      >
        {!isVerifying ? (
          <>
            <div className="flex gap-5">
              <Input placeholder="First Name" {...register("firstName")} />
              <Input placeholder="Last name" {...register("lastName")} />
            </div>
            <Input
              placeholder="Username"
              className={`w-full sm:w-96`}
              {...register("username")}
            />
            <div>
              <Input
                placeholder="Email"
                className={`w-full sm:w-96`}
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="gap-5 flex flex-col">
              <div>
                <Input
                  placeholder="Password"
                  type="password"
                  className={`w-full sm:w-96`}
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={!isValid}
                className="w-full sm:w-96"
              >
                Signup
              </Button>
              <div className="relative flex w-full items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink text-xs mx-4 text-gray-400">
                  OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <Button variant={"outline"} type="button" onClick={handleGoogleSignup} className="w-full sm:w-96 shadow-md">
                <img src={Google} alt="brand-logo" className="h-3 w-3 me-2" />
                Continue with Google
              </Button>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <a className="font-bold" onClick={() => router("/sign-in")}>
                  Login
                </a>
              </p>
            </div>
          </>
        ) : (
          <div className="gap-5 w-full sm:w-96 items-center flex-col flex">
            <div className="gap-3 flex flex-col items-center">
              <InputOTP maxLength={6} onChange={(e) => setCode(e)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="sm:h-12 sm:w-14" />
                  <InputOTPSlot index={1} className="sm:h-12 sm:w-14" />
                  <InputOTPSlot index={2} className="sm:h-12 sm:w-14" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="sm:h-12 sm:w-14" />
                  <InputOTPSlot index={4} className="sm:h-12 sm:w-14" />
                  <InputOTPSlot index={5} className="sm:h-12 sm:w-14" />
                </InputOTPGroup>
              </InputOTP>
              <a className="text-gray-400">
                Didn't receive a code? Resend {isDisabled ? `${countdown}` : ""}
              </a>
            </div>
            <div className="gap-3 flex flex-col items-center">
              <Button
                type="submit"
                className="w-full sm:w-96 "
                onClick={submitSignup}
              >
                Signup
              </Button>
              <a
                className="text-gray-600"
                onClick={() => setIsVerifying(false)}
              >
                Return to signup
              </a>
            </div>
          </div>
        )}
      </LayoutAuth>
    </>
  );
};

export default signUp;
