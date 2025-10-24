import DefaultProfile from "@/assets/images/default.png";
import { navigationData } from "@/routing/navigationData";
import { Bell, Menu, Sun } from "lucide-react";
import { Button } from "./ui/button";
import ModeToggle from "@/shared/components/ModeToggle";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import { useCookies } from "react-cookie";
import { decryptString } from "@/shared/utils/CustomFunctions";

const Header = () => {
  const [cookies] = useCookies();
  const userInfo = cookies?.user ? decryptString(cookies.user) : null;

  return (
    <header className="sticky top-0 bg-background z-50 border-b items-center">
      <div className="flex w-full justify-between py-3 px-6">
        <div className="flex items-center gap-5">
          <SidebarTrigger className="flex md:hidden" />
          <p className="hidden sm:inline">
            Good morning, {userInfo?.firstName}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <ModeToggle />
          <Button variant="ghost" className="w-10 h-10">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="relative w-10 h-10">
            <div className="h-10 w-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={userInfo?.profileImage || DefaultProfile}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-3 w-3 rounded-full absolute bottom-0 right-0 bg-success border-2 border-white"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
