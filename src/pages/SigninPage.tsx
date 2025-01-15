// app/components/SignInForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schema/schema";
import Google from "../assets/images/Google.svg";
import Logo from "../assets/images/Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetAuthStatusQuery,
  usePostSigninMutation,
} from "@/feature/authentication/api/signinApi";
import { setUserInfo } from "@/feature/authentication/reducers/userDetail";
import LayoutAuth from "@/components/authentication/LayoutAuth";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { decryptString } from "@/utils/CustomFunctions";

const SignInPage = () => {
  const router = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["user"]);
  const [postSignin] = usePostSigninMutation();

  const searchParams = new URLSearchParams(location.search);
  const errorStatus = searchParams.get("error");
  const message = searchParams.get("message");

  const { error, data, isLoading } = useGetAuthStatusQuery({});

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema.schema),
    mode: "onChange",
    defaultValues: loginSchema.defaultValues,
  });

  useEffect(() => {
    if (data?.authenticated && !error && cookies.user) {
      console.log("test1");
      router("/"); // Redirect to home if already authenticated
    }
  }, [data, router]);

  useEffect(() => {
    if (errorStatus) {
      setTimeout(() => {
        toast.error(message);
      }, 500);
    }
  }, [errorStatus, message]);

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isValid) {
      try {
        const response = await postSignin({
          email: watch("email"),
          password: watch("password"),
        }).unwrap();
        router("/");
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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google/sign-in"; // Redirect to backend OAuth route
  };

  return (
    <>
      {!isLoading && (!data?.authenticated || !cookies.user) && (
        <>
          {" "}
          <LayoutAuth
            title="Welcome back"
            desc="Let's get started to track your expenses"
            submit={onSubmit}
          >
            <div className="mt-5 w-full gap-5 sm:w-96 flex-col flex">
              <Input
                placeholder="Email"
                className="w-full sm:w-96"
                {...register("email")}
                required
              />
              <Input
                placeholder="Password"
                type="password"
                className="w-full sm:w-96"
                {...register("password")}
                required
              />
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-right -mt-4"
                  onClick={() => router("/forgot-password")}
                >
                  Forgot Password?
                </a>
              </div>
              <Button
                className="w-full sm:w-96 text-right"
                disabled={!isValid}
                type="submit"
              >
                Login
              </Button>
            </div>
            <div className="relative flex py-3 w-full sm:w-full items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink text-xs mx-4 text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant={"outline"}
              className="w-full sm:w-96 shadow-md"
            >
              <img src={Google} alt="brand-logo" className="h-3 w-3 me-2" />
              Continue with Google
            </Button>
            <p className="mt-2 text-sm text-center">
              Don't have an account?{" "}
              <a className="font-bold " onClick={() => router("/sign-up")}>
                Sign Up
              </a>
            </p>
          </LayoutAuth>
        </>
      )}
    </>
  );
};

export default SignInPage;
