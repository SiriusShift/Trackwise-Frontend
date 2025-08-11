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
import { ArrowLeft, ArrowRightIcon } from "lucide-react";
import useScreenWidth from "@/shared/hooks/useScreenWidth";

const SettingsLayout = () => {
  const location = useLocationHook();
  const navigate = useNavigate();
  const width = useScreenWidth();
  console.log(width);
  const [activeTab, setActiveTab] = useState("Settings");

  console.log(location);

  const subNavigation = navigationData?.find(
    (item) => item?.name === "Settings"
  )?.sub;

  const Tabs = () => {
    return (
      <div className="sm:flex flex-col h-auto gap-2 sm:flex-row sm:pb-1 overflow-auto">
        {subNavigation?.map((item, index) => {
          return (
            <Link
              key={index}
              className={`${
                location?.location?.pathname === item?.path
                  ? "sm:border-b border-primary font-semibold text-primary"
                  : "text-foreground sm:text-gray-400"
              } p-2`}
              to={item?.path}
              onClick={() => setActiveTab(item?.name)}
            >
              <span className="flex justify-between pr-2 sm:pr-0">
                <span className="flex gap-4">
                  <item.icon className="sm:hidden" /> {item.name}{" "}
                </span>
                <ArrowRightIcon className="sm:hidden" />
              </span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {/* Settings Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {location?.location?.pathname !== "/settings" && (
            <Button
              className="sm:hidden"
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                navigate("/settings");
                setActiveTab("Settings");
              }}
            >
              {" "}
              <ArrowLeft className="sm:hidden" />
            </Button>
          )}

          <h1 className="font-semibold text-xl">
            {width < 640 ? activeTab : "Settings"}
          </h1>
        </div>
        <div>
          {width < 640 ? (
            location?.location?.pathname === "/settings" ? (
              <Tabs />
            ) : null
          ) : (
            <Tabs />
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
