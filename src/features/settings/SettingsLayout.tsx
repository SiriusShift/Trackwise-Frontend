import { navigationData, settingsNavigation } from "@/routing/navigationData";
import { Button } from "@/shared/components/ui/button";
import React, { useState } from "react";
import {
  Link,
  Outlet,
  useMatch,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import useLocationHook from "@/shared/hooks/useLocation";
import { Separator } from "@/shared/components/ui/separator";

const SettingsLayout = () => {
  const location = useLocationHook();
  const [active, setActive] = useState(location?.location?.pathname);

  const subNavigation = navigationData?.find((item) => item?.name === "Settings")?.sub

  const navigate = useNavigate();
  return (
    <div>
      {/* Settings Header */}
      <div className="flex flex-col gap-5">
        <h1 className="font-semibold text-xl">Settings</h1>
        <div>
          <div className="flex gap-5">
            {subNavigation?.map((item) => {
              return (
                <Link
                  className={`${
                    location?.location?.pathname === item?.path
                      ? "border-b border-primary text-primary"
                      : "text-gray-400"
                  } p-2`}
                  to={item?.path}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <Separator />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
