// app/components/SignUpForm.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../shared/components/ui/input-otp";
// import Logo from "../assets/images/Logo.svg";
import Google from "@/assets/images/Google.svg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  encryptString,
  handleCatchErrorMessage,
} from "../../../shared/utils/CustomFunctions";
import { signupSchema } from "../schema/authSchema";
// import { setSignup } from "../feature/authentication/reducers/signupSlice";
import { Check, Loader2, X } from "lucide-react";
import moment from "moment-timezone";
import LayoutAuth from "../../../layout/AuthLayout";
import { usePostSignupMutation, usePostVerifyMutation } from "../api/signupApi";

const passwordChecks = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  {
    label: "One special character (!@#$%^&*()_+)",
    test: (v: string) => /[!@#$%^&*()_+]/.test(v),
  },
];

const signUp = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [code, setCode] = useState("");
  // const device = encryptString(getBrowserInfo());
  const router = useNavigate();
  const tz = moment.tz.guess();
const API_URL = import.meta.env.VITE_PUBLIC_BASEURL;

  const [postVerify, { isLoading }] = usePostVerifyMutation();
  const [postSignup, { isLoading: postSignupLoading }] =
    usePostSignupMutation();

  const {
    register,
    getValues,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema.schema),
    mode: "onChange",
    defaultValues: signupSchema.defaultValues,
  });

  const [passwordFocused, setPasswordFocused] = useState(false);
  const passwordField = register("password");
  const passwordValue = watch("password") || "";

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
        timezone: tz,
        otp: code || "",
      }).unwrap();
      console.log(response);
      router("/");
    } catch (err) {
      let errorMessage = handleCatchErrorMessage(err); // Default message
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    console.log("test");
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
        let errorMessage = handleCatchErrorMessage(err); // Default message
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
  window.location.href = `${API_URL}/auth/google/sign-up`;
};

  const resendCode = () => {
    setIsDisabled(true); // ⬅️ disable resend immediately
    setCountdown(60); // ⬅️ start 60-second countdown
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsDisabled(false); // ⬅️ re-enable when timer ends
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
              <div className="relative">
                <Input
                  placeholder="Password"
                  type="password"
                  className={`w-full sm:w-96`}
                  {...passwordField}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => {
                    passwordField.onBlur(e);
                    setPasswordFocused(false);
                  }}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {passwordFocused && (
                  <ul className="absolute z-10 mt-2 w-full sm:w-96 rounded-md border bg-card p-3 shadow-md text-sm flex flex-col gap-1">
                    {passwordChecks.map((check) => {
                      const passed = check.test(passwordValue);
                      return (
                        <li
                          key={check.label}
                          className={`flex items-center gap-2 ${
                            passed ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {passed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {check.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {!passwordFocused && errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full sm:w-96"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Signup"}
              </Button>
              <div className="relative flex w-full items-center">
                <div className="grow border-t border-gray-400"></div>
                <span className="shrink text-xs mx-4 text-gray-400">
                  OR CONTINUE WITH
                </span>
                <div className="grow border-t border-gray-400"></div>
              </div>
              <Button
                variant={"outline"}
                type="button"
                onClick={handleGoogleSignup}
                className="w-full sm:w-96 shadow-md"
              >
                <img src={Google} alt="brand-logo" className="h-3 w-3 me-2" />
                Continue with Google
              </Button>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <a
                  className="font-bold cursor-pointer"
                  onClick={() => router("/sign-in")}
                >
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
              <a
                className={`cursor-pointer ${
                  isDisabled
                    ? "text-gray-400 pointer-events-none"
                    : "text-blue-500"
                }`}
                onClick={!isDisabled ? onSubmit : undefined}
              >
                {isDisabled
                  ? `Resend in ${countdown}s`
                  : "Didn't receive a code? Resend"}
              </a>
            </div>
            <div className="gap-3 flex flex-col items-center">
              <Button
                type="submit"
                className="w-full sm:w-96"
                onClick={submitSignup}
                disabled={postSignupLoading}
              >
                {postSignupLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Signup"
                )}
              </Button>
              <p
                className="text-gray-600  cursor-pointer"
                onClick={() => setIsVerifying(false)}
              >
                Return to signup
              </p>
            </div>
          </div>
        )}
      </LayoutAuth>
    </>
  );
};

export default signUp;
