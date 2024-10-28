import { useState } from "react";
import Logo from "../assets/images/Logo.svg";
import Dashboard from "../assets/images/Dashboard.svg";
import Loan from "../assets/images/Loan Icon.svg";
import {
  Wallet,
  HandCoins,
  LayoutGrid,
  Landmark,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useLazyGetSignoutQuery } from "../feature/authentication/api/signinApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigationData } from "@/navigation/navigationData";

type IconName = "LayoutGrid" | "Wallet" | "HandCoins" | "Landmark" | "Settings" | "LogOut";

const iconMap: Record<IconName, React.ComponentType> = {
  LayoutGrid: LayoutGrid,
  Wallet: Wallet,
  HandCoins: HandCoins,
  Landmark: Landmark,
  Settings: Settings,
  LogOut: LogOut,
};

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const router = useNavigate();

  const [logoutTrigger] = useLazyGetSignoutQuery({});

  const logout = () => {
    logoutTrigger({});
    router("/sign-in");
  };

  return (
    <div className="xl:w-[280px] fixed top-0 left-0 h-full min-h-svh sm:p-3 xl:p-5 pt-2 border-r-2">
      <div className="flex xl:ms-2 mt-5 justify-center xl:justify-start">
        <img src={Logo} width={"27px"} alt="trackwise logo" />
        <h1 className="text-xl ml-4 hidden xl:inline">Trackwise</h1>
      </div>
      <div className="xl:flex mt-12 xl:flex-col justify-between h-[580px]">
        <div className="gap-3 flex flex-col overflow-scroll">
          {navigationData.map((item) => {
            const IconComponent = iconMap[item.icon as IconName];
            return (
              <Button
                key={item.name}
                size={"lg"}
                variant={active === item.name ? "default" : "ghost"}
                onClick={() => {
                  setActive(item.name);
                  router(item.path);
                }}
                className="xl:flex text-md px-3 xl:p-3 xl:justify-start xl:w-full"
              >
                {IconComponent && (
                  <IconComponent
                    style={{ width: "25px", height: "25px" }}
                    className="xl:mr-3"
                  />
                )}
                <span className="hidden xl:inline">{item.name}</span>
              </Button>
            );
          })}
          <Button
            size={"lg"}
            variant={"ghost"}
            className="xl:flex text-md px-3 xl:p-3 xl:justify-start xl:w-full"
            onClick={logout}
          >
            <LogOut
              style={{ width: "25px", height: "25px" }}
              className="xl:mr-3"
            />{" "}
            <span className="hidden xl:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
