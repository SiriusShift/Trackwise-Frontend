// app/components/SignInForm.tsx
"use client";
import Google from "@/assets/images/Google.svg";
import {
  useGetAuthStatusQuery,
  usePostGoogleOneTapMutation,
  usePostSigninMutation,
} from "@/features/auth/api/signinApi";
import LayoutAuth from "@/layout/AuthLayout";
import { Button } from "@/shared/components/ui/button";
import { Input, PasswordInput } from "@/shared/components/ui/input";
import { handleCatchErrorMessage } from "@/shared/utils/CustomFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema } from "../schema/authSchema";

const SignInPage = () => {
  const router = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["user"]);
  const [postSignin, { isLoading: signinLoading }] = usePostSigninMutation();
  const [postGoogleOneTap] = usePostGoogleOneTapMutation();

  const searchParams = new URLSearchParams(location.search);
  const errorStatus = searchParams.get("error");
  const message = searchParams.get("message");
const API_URL = import.meta.env.VITE_PUBLIC_BASEURL;

  const { error, data, isLoading } = useGetAuthStatusQuery({});

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema.schema),
    mode: "onChange",
    defaultValues: loginSchema.defaultValues,
  });

  useEffect(() => {
    if (data?.authenticated && !error && cookies.user) {
      console.log("test1");
      router("/"); // Redirect to home if already authenticated
    }
  }, [data, router]);

  // Google One Tap
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || isLoading || data?.authenticated) return;

    const init = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id) return;
      google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: true,
        callback: async ({ credential }: { credential: string }) => {
          try {
            await postGoogleOneTap({ credential }).unwrap();
            window.location.href = "/";
          } catch (err) {
            toast.error(handleCatchErrorMessage(err));
          }
        },
      });
      google.accounts.id.prompt();
    };

    if ((window as any).google?.accounts?.id) {
      init();
      return () => (window as any).google?.accounts?.id?.cancel();
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.head.appendChild(script);
    return () => (window as any).google?.accounts?.id?.cancel();
  }, [isLoading, data?.authenticated, postGoogleOneTap]);

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
        await postSignin({
          email: watch("email"),
          password: watch("password"),
        }).unwrap();
        router("/");
      } catch (error) {
        console.log(error);
        let errorMessage = handleCatchErrorMessage(error); // Default message
        toast.error(errorMessage);
      }
    } else {
      console.log(errors);
    }
  };

const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/auth/google/sign-in`;
};
  return (
    <>
      {!isLoading && (!data?.authenticated || !cookies.user) && (
        <>
          {" "}
          <LayoutAuth
            title="Welcome back"
            desc="Let's get started to track your finances"
            submit={onSubmit}
          >
            <div className="mt-5 w-full gap-5 sm:w-96 flex-col flex">
              <Input
                placeholder="Email"
                className="w-full sm:w-96"
                {...register("email")}
                required
              />
              <PasswordInput
                placeholder="Password"
                className="w-full sm:w-96"
                {...register("password")}
                required
              />
              <div className="flex justify-end">
                <p
                  className="text-sm text-right -mt-4"
                  onClick={() => router("/forgot-password")}
                >
                  Forgot Password?
                </p>
              </div>
              <Button
                className="w-full sm:w-96 text-right"
                disabled={!isValid || signinLoading}
                type="submit"
              >
                {signinLoading && <Loader2 className="animate-spin" />}Login
              </Button>
            </div>
            <div className="relative flex py-3 w-full sm:w-full items-center">
              <div className="grow border-t border-gray-400"></div>
              <span className="shrink text-xs mx-4 text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="grow border-t border-gray-400"></div>
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
              <a
                className="font-bold cursor-pointer"
                onClick={() => router("/sign-up")}
              >
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
