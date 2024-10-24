// app/components/SignInForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schema/schema";
import Google from "../assets/images/Google.svg";
import Logo from "../assets/images/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast, Toaster } from "sonner";
import {
  useGetAuthStatusQuery,
  usePostSigninMutation,
} from "@/feature/authentication/api/signinApi";
import { userInfo } from "@/feature/authentication/reducers/userDetail";
import LayoutAuth from "@/components/authentication/LayoutAuth";
import { useEffect, useState } from "react";

const SignInPage = () => {
  const router = useNavigate();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const [postSignin] = usePostSigninMutation();
  const { data, error } = useGetAuthStatusQuery({});

  useEffect(() => {
    if (data) {
      setIsAuthenticated(true);
    }
  });

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isValid) {
      try {
        const response = await postSignin({
          email: watch("email"),
          password: watch("password"),
        }).unwrap();
        dispatch(
          userInfo({
            id: response?.user?.id,
            email: response?.user?.email,
            username: response?.user?.username,
            firstName: response?.user?.firstName,
            lastName: response?.user?.lastName,
            role: response?.user?.role,
            phoneNumber: response?.user?.phoneNumber,
            profileImage: response?.user?.profileImage,
          })
        );
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

  return (
    <>
      {/* {!isAuthenticated ? (
        router("/")
      ) : ( */}
        <LayoutAuth
          title="Welcome back"
          desc="Let's get started to track your expenses"
          submit={onSubmit}
        >
          <div
            className="mt-5 w-full gap-5 sm:w-96 flex-col flex"
            // onSubmit={}
          >
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
            <p
              className="text-sm text-right -mt-4"
              onClick={() => router("/forgot-password")}
            >
              Forgot Password?
            </p>
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
          <Button variant={"outline"} className="w-full sm:w-96 shadow-md">
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
      {/* )} */}
      <Toaster visibleToasts={5} />
    </>
  );
};

export default SignInPage;
