import { useLazyGetSignoutQuery } from "@/features/auth/api/signinApi";
import { cn } from "@/lib/utils";
import { api } from "@/shared/services/api";
import { useDispatch } from "react-redux";
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

// Labels fade and shrink in sync with the sidebar's width transition when collapsed to icons.
const LABEL_CLASSES =
  "ml-2 whitespace-nowrap overflow-hidden max-w-[160px] opacity-100 transition-[max-width,opacity,margin] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 motion-reduce:transition-none";

export function AppSidebar() {
  const location = useLocationHook();
  const parent = `/${location?.location?.pathname?.split("/")[1]}`;

  const [, , removeCookie] = useCookies(["user"]);
  const [, setActive] = useState(location?.location?.pathname);
  const router = useNavigate();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const screenWidth = useScreenWidth();

  const [logoutTrigger] = useLazyGetSignoutQuery({});
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutTrigger({}).unwrap();
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      removeCookie("user", { path: "/" });
      // Drop all cached API data (incl. stale auth-status) and cancel in-flight requests
      dispatch(api.util.resetApiState());
      router("/sign-in", { replace: true });
    }
  };

  const pathname = location?.location?.pathname;

  useEffect(() => {
    setActive(pathname);
    // Close the mobile sheet after any navigation (incl. back/forward).
    // Keyed on the pathname string: useLocationHook returns a new object every render.
    if (isMobile) setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar
      collapsible={screenWidth < 1024 ? "offcanvas" : "icon"}
      className="overflow-hidden z-50"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 flex">
        <div
          className={`flex justify-start md:justify-center lg:justify-start items-center gap-2 w-full lg:ms-1  mt-2`}
        >
          <WalletMinimal className="text-primary shrink-0 w-6 h-6" />
          <span className={cn(LABEL_CLASSES, "ml-0 font-bold text-lg inline md:hidden lg:inline")}>
            Trackwise
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup className="p-3 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.map((item) => {
                return (
                  <SidebarMenuItem
                    className="flex justify-center lg:justify-start lg:ms-1"
                    key={item.name}
                    data-tour={`nav-${item.name.toLowerCase()}`}
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
                                onClick={() => {
                                  setActive(item.path);
                                  if (isMobile) setOpenMobile(false);
                                }}
                                className="flex items-center rounded justify-start"
                              >
                                <item.icon
                                  style={{ width: "17px", height: "17px" }}
                                />
                                <span className={LABEL_CLASSES}>
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
              <SidebarMenuItem
                className="flex justify-center lg:justify-start lg:ms-1"
                key="nav-logout"
              >
                {screenWidth > 767 && screenWidth < 1024 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          className="hidden md:block w-10 h-10 lg:hidden"
                          variant="ghost"
                          onClick={handleLogout}
                        >
                          <LogOut style={{ width: "24px", height: "24px" }} />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={5}
                        className="p-2 px-4 rounded-lg shadow-md bg-primary text-primary-foreground"
                      >
                        <p className="tracking-wide">Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center rounded justify-start"
                        >
                          <LogOut style={{ width: "17px", height: "17px" }} />
                          <span className={LABEL_CLASSES}>
                            Logout
                          </span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="p-1 px-4 rounded-lg shadow-md bg-primary text-primary-foreground"
                        >
                          <p className="tracking-wide">Logout</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-3 items-center"></SidebarFooter>
    </Sidebar>
  );
}
