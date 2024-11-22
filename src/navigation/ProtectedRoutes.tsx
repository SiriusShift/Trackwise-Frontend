import React, { useEffect } from "react";
import { useLazyGetAuthStatusQuery } from "../feature/authentication/api/signinApi";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

function ProtectedRoutes() {
  const navigate = useNavigate();
  // const [authTrigger, { data, error }] = useLazyGetAuthStatusQuery();

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     console.log("hello")
  //     try {
  //       const response = await authTrigger({}).unwrap();
  //       console.log("Auth status:", response);
  //       if(!response){
  //         navigate("/sign-in");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching auth status:", err);
  //       navigate("/sign-in");
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  // return <>{data && <MainLayout />}</>;

  return <MainLayout />;
}

export default ProtectedRoutes;
