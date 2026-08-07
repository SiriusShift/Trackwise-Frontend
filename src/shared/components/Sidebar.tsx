import { useLazyGetSignoutQuery } from "@/features/auth/api/signinApi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import useLocationHook from "@/shared/hooks/useLocation";
import useScreenWidth from "@/shared/hooks/useScreenWidth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { LogOut, WalletMinimal } from "lucide-react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { navigationData } from "../../routing/navigationData";
export function AppSidebar() {
  const location = useLocationHook();
  const parent = `/${location?.location?.pathname?.split("/")[1]}`;
  console.log(parent);

  const [, , removeCookie] = useCookies(["user"]);
  const [active, setActive] = useState(location?.location?.pathname);
  console.log(active);
  const router = useNavigate();
  const { state } = useSidebar();
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
      collapsible={screenWidth < 1024 ? "offcanvas" : "icon"}
      className="
    transition-all duration-300 ease-in-out
    w-[240px]
    data-[state=collapsed]:w-[64px]
    overflow-hidden
    z-50
  "
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 flex">
        <div
          className={`flex justify-start md:justify-center lg:justify-start lg:date-[state=collapsed]:justify-center items-center gap-2 w-full lg:ms-1  mt-2`}
        >
          <WalletMinimal className="text-primary shrink-0 w-6 h-6" />
          <h1
            className="
    font-bold text-lg
    transition-all duration-300
    whitespace-nowrap
    overflow-hidden
    max-w-[160px]
    data-[state=collapsed]:max-w-0
    data-[state=collapsed]:opacity-0
    inline
    md:hidden
    lg:inline
  "
          >
            Trackwise
          </h1>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup className="p-3 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.map((item) => {
                const isCollapsed = state === "collapsed";

                return (
                  <SidebarMenuItem
                    className="flex justify-center lg:justify-start lg:ms-1"
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
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip disableHoverableContent={!isCollapsed}>
                          <TooltipTrigger asChild disabled={!isCollapsed}>
                            <SidebarMenuButton
                              variant={
                                parent === item.path ? "default" : "ghost"
                              }
                              asChild
                            >
                              <Link
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className="
                                  flex items-center rounded
                                  transition-all duration-300
                                  justify-start
                                  data-[state=collapsed]:justify-center
                                "
                              >
                                <item.icon
                                  style={{ width: "17px", height: "17px" }}
                                />
                                <span
                                  className="
                              ml-2
                              transition-all duration-300
                              whitespace-nowrap
                              overflow-hidden
                              max-w-[160px]
                              data-[state=collapsed]:max-w-0
                              data-[state=collapsed]:opacity-0
                            "
                                >
                                  {item.name}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent
                              side="right"
                              sideOffset={5}
                              className="p-1 px-4 rounded-lg shadow-md bg-primary text-primary-foreground"
                            >
                              <p className="tracking-wide">{item.name}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-3">
        <SidebarMenuButton
          variant="ghost"
          className="lg:flex ms-1 justify-start lg:w-full rounded w-[100%]"
          onClick={handleLogout}
        >
          <LogOut />
          <span
            className="
                ml-2
                transition-all duration-300
                whitespace-nowrap
                overflow-hidden
                max-w-[120px]
                data-[state=collapsed]:max-w-0
                data-[state=collapsed]:opacity-0
              "
          >
            Logout
          </span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
