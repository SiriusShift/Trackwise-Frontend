import DefaultProfile from "../assets/images/default.png";
import {navigationData} from "../navigation/navigationData";
import { Bell, Menu, Sun } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "./mode-toggle";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
const Header = () => {
  const location = useLocation();
  const currentPageName = navigationData.find(
    (item) => item.path === location.pathname
  )
  return (
    <div className="flex border-b-2  items-center justify-between">
      <div className="flex w-full justify-between py-3 px-6">
        <div className="flex items-center gap-5">
          <SidebarTrigger className="inline md:hidden" />
          <p className="text-xl">{currentPageName?.name}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-5 justify-between">
          <ModeToggle />
          <Button variant="ghost" className="w-10 h-10">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="h-10 w-10 bg-gray-300 rounded-full items-center justify-center flex">
            <img src={DefaultProfile} width={"20px"} alt="Profile Picture" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
