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
  const [active, setActive] = useState("Dashboard");
  const router = useNavigate();

  const [logoutTrigger] = useLazyGetSignoutQuery({});

  const logout = () => {
    logoutTrigger({});
    router("/sign-in");
  };

  return (
    <div className="lg:w-[265px] hidden lg:inline fixed top-0 left-0 h-full min-h-svh sm:p-3 lg:p-5 pt-2 border-r-2 flex flex-col">
      <div className="flex lg:ms-3 mt-2 justify-center lg:justify-start">
        <img src={Logo} width={"27px"} alt="trackwise logo" />
        <h1 className="text-lg ml-4 hidden lg:inline">Trackwise</h1>
      </div>

      {/* Main Content Wrapper with Scroll */}
      <div className="flex-1 mt-12 overflow-y-auto max-h-[calc(100vh-5rem)] your-scrollable-class">
        <div className="gap-3 flex flex-col">
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
                className="lg:flex text-md px-3 lg:p-3 lg:justify-start lg:w-full"
              >
                {IconComponent && (
                  <IconComponent
                    style={{ width: "25px", height: "25px" }}
                    className="lg:mr-3"
                  />
                )}
                <span className="hidden lg:inline">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Settings Button Stuck to the Bottom */}
      <div className="mt-auto">
        <Button
          size={"lg"}
          variant={"ghost"}
          className="lg:flex text-md px-3 lg:p-3 lg:justify-start lg:w-full"
          onClick={logout}
        >
          <LogOut
            style={{ width: "25px", height: "25px" }}
            className="lg:mr-3"
          />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
