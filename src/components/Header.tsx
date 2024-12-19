import DefaultProfile from "../assets/images/default.png";
import { navigationData } from "../navigation/navigationData";
import { Bell, Menu, Sun } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "./mode-toggle";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import { useCookies } from "react-cookie";
import { decryptString } from "@/utils/CustomFunctions";

const Header = () => {
  const [cookies] = useCookies();
  const userInfo = decryptString(cookies?.user);
  console.log(userInfo);
  
  return (
    <div className="flex bg-background sticky right-0 top-0 w-full border-b items-center justify-between">
      <div className="flex w-full justify-between py-3 px-6">
        <div className="flex items-center gap-5">
          <SidebarTrigger className="inline md:hidden" />
          <p className="hidden sm:inline">
            Good morning, {userInfo?.firstName}
          </p>
          {/* <p className="text-xl">{currentPageName?.name}</p> */}
        </div>
        <div className="flex items-center gap-2 sm:gap-5 justify-between">
          <ModeToggle />
          <Button variant="ghost" className="w-10 h-10">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="relative w-10 h-10">
            {/* Profile Picture */}
            <div className="h-10 w-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={userInfo?.profileImage || DefaultProfile}
                alt="Profile Picture"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Blinking Status Indicator */}
            <div
              className={`h-3 w-3 rounded-full absolute bottom-0 right-0 bg-success border-2 border-white`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
