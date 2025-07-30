import React, { useEffect } from "react";
import { useLazyGetAuthStatusQuery } from "../features/auth/api/signinApi";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useCookies } from "react-cookie";
import { encryptString } from "@/shared/utils/CustomFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/shared/slices/userSlice";
import { setSettings } from "@/shared/slices/settingsSlice";

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [authTrigger, { data, error }] = useLazyGetAuthStatusQuery();
  const dispatch = useDispatch();
  console.log(data);
  const [cookies, setCookie] = useCookies(["user"]);
  const userInfo = useSelector((state) => state?.userDetails?.id)
  console.log(userInfo);

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("hello")
      try {
        const response = await authTrigger({}).unwrap();
        if(!response && error){
          navigate("/sign-in");
        }else if(!userInfo || !cookies.user){
          console.log("NO COOKIE");
          dispatch(
            setUserInfo({
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
          dispatch(
            setSettings({
              timezone: response?.settings?.timezone,
              timeFormat: response?.settings?.timeFormat
            })
          )
        }
        if(!cookies.user){
          const encryptedInfo = encryptString(response?.user);
          setCookie("user", encryptedInfo, {path: "/", maxAge: 7 * 24 * 60 * 60});
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
