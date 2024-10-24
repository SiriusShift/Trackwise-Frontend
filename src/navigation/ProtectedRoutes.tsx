// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {useGetAuthStatusQuery} from "../feature/authentication/api/signinApi";
import { useNavigate } from 'react-router-dom';
import MainLayout from "../layout/MainLayout";
// import PermittedRoutes from "./PermittedRoutes";
// import { jwtDecode } from "jwt-decode";
function ProtectedRoutes() {
  const router = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {data, error} = useGetAuthStatusQuery({});
  console.log(data, error)
  useEffect(() => {
    if(data){
      setIsAuthenticated(true);
    }else if(error){
      setIsAuthenticated(false);
      router("/sign-in");
    }
  }, [data, error]);

  if(isAuthenticated){
    return <MainLayout />;    
  }
}

export default ProtectedRoutes;
