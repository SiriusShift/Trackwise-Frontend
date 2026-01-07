import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";
import { WalletMinimal, LogOut } from "lucide-react";
import { navigationData } from "../../routing/navigationData";
import { useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@radix-ui/react-tooltip";
import { useLazyGetSignoutQuery } from "@/features/auth/api/signinApi";
import { Button } from "./ui/button";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import useLocationHook from "@/shared/hooks/useLocation";
import { useCookies } from "react-cookie";
export function AppSidebar() {
  const location = useLocationHook();
  const parent = `/${location?.location?.pathname?.split("/")[1]}`;
  console.log(parent);

  const [, , removeCookie] = useCookies(["user"]);
  const [active, setActive] = useState(location?.location?.pathname);
  console.log(active);
  const router = useNavigate();
  const screenWidth = useScreenWidth();

  const [logoutTrigger] = useLazyGetSignoutQuery({});

  const handleLogout = () => {
    logoutTrigger({});
    removeCookie("user", { path: "/" });
    router("/sign-in");
  };

  useEffect(() => {
    setActive(location?.location?.pathname);
  }, [location]);

  return (
    <Sidebar
      className={`transition-all duration-300 ease-in-out w-20 overflow-hidden z-50`}
      style={{ willChange: "width, opacity" }} // Optimize for smooth transitions
    >
      {/* Sidebar Header */}
      <SidebarHeader className="mx-2 py-3 ">
        <div
          className={`flex items-center ml-3 transition-opacity duration-300 ease-in-out opacity-100 lg:ms-3 mt-3 justify-start`}
        >
          <WalletMinimal className="text-primary" />
            <h1 className="text-lg ml-4 inline md:hidden lg:inline font-bold">
              Trackwise
            </h1>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup className="px-4 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.map((item) => {
                console.log(item?.name);
                return (
                  <SidebarMenuItem
                    className="flex justify-center"
                    key={item.name}
                  >
                    {screenWidth > 767 && screenWidth < 1024 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <SidebarMenuButton
                              className="hidden md:block w-10 h-10 lg:hidden"
                              variant={
                                parent === item.path ? "default" : "ghost"
                              }
                              asChild
                            >
                              <Link
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className="lg:flex"
                              >
                                <item.icon
                                  style={{ width: "24px", height: "24px" }}
                                />
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            sideOffset={5}
                            className="p-2 px-4 rounded-lg shadow-md bg-primary text-primary-foreground"
                          >
                            <p className="tracking-wide">{item.name}</p>
                            {/* <TooltipArrow className="bg-primary-foreground" />{" "} */}
                            {/* Add styles to customize the arrow */}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <SidebarMenuButton
                        variant={parent === item.path ? "default" : "ghost"}
                        asChild
                      >
                        <Link
                          to={item.path}
                          onClick={() => setActive(item.path)}
                          className="lg:flex text-md px-3 lg:p-3 justify-start lg:w-full h-[42px] rounded w-[100%]"
                        >
                          <item.icon
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span className="inline md:hidden lg:inline">
                            {item.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <div className="mx-3 py-2">
          <SidebarMenuButton
            variant="ghost"
            className="lg:flex text-md px-3 lg:p-3 justify-start lg:w-full h-[42px] rounded w-[100%]"
            onClick={handleLogout}
          >
            <LogOut
              style={{ width: "24px", height: "24px" }}
              className="lg:mr-3"
            />
            <span className="inline md:hidden lg:inline">Logout</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
