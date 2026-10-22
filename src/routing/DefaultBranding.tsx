import { useTheme } from "@/shared/provider/ThemeProvider";
import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";

const DefaultBranding = () => {
  const { setDefaultBranding } = useTheme();

  useLayoutEffect(() => {
    setDefaultBranding(true);
    return () => setDefaultBranding(false);
  }, [setDefaultBranding]);

  return <Outlet />;
};

export default DefaultBranding;
