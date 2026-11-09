import { useTheme } from "@/shared/provider/ThemeProvider";
import { useIsomorphicLayoutEffect } from "@/shared/hooks/useIsomorphicLayoutEffect";
import { Outlet } from "react-router-dom";

const DefaultBranding = () => {
  const { setDefaultBranding } = useTheme();

  useIsomorphicLayoutEffect(() => {
    setDefaultBranding(true);
    return () => setDefaultBranding(false);
  }, [setDefaultBranding]);

  return <Outlet />;
};

export default DefaultBranding;
