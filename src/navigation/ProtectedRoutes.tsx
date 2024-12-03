import React, { useEffect } from "react";
import { useLazyGetAuthStatusQuery } from "../feature/authentication/api/signinApi";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useCookies } from "react-cookie";
import { encryptString } from "@/utils/CustomFunctions";

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [authTrigger, { data, error }] = useLazyGetAuthStatusQuery();
  const [cookies, setCookie] = useCookies(["user"]);

  console.log(cookies);

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("hello")
      try {
        const response = await authTrigger({}).unwrap();
        if(!response){
          navigate("/sign-in");
        }else if(!cookies?.user){
          console.log("NO COOKIE");
          const userInfo = encryptString(response?.user) 
          console.log(response);
          setCookie("user", userInfo, {path: "/", maxAge: 7 * 24 * 60 * 60})
        }
      } catch (err) {
        console.error("Error fetching auth status:", err);
        navigate("/sign-in");
      }
    };
    checkAuthStatus();
  }, []);

  return <>{data && <MainLayout />}</>;

  // return <MainLayout />;
}

export default ProtectedRoutes;
