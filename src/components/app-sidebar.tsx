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
} from "@/components/ui/sidebar";
import { WalletMinimal, LogOut } from "lucide-react";
import { navigationData } from "../navigation/navigationData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@radix-ui/react-tooltip";
import { useLazyGetSignoutQuery } from "@/feature/authentication/api/signinApi";
import { Button } from "./ui/button";
import useScreenWidth from "@/hooks/useScreenWidth";
export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const router = useNavigate();
  const screenWidth = useScreenWidth();
  console.log(screenWidth);

  const [logoutTrigger] = useLazyGetSignoutQuery({});

  const handleLogout = () => {
    logoutTrigger({});
    router("/sign-in");
  };

  return (
    <Sidebar
      className={`transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      } overflow-hidden`}
      style={{ willChange: "width, opacity" }} // Optimize for smooth transitions
    >
      {/* Sidebar Header */}
      <SidebarHeader className="px-4">
        <div
          className={`flex items-center ml-3 transition-opacity duration-300 ease-in-out ${
            isExpanded ? "opacity-100" : "opacity-0"
          } lg:ms-3 mt-3 justify-start`}
        >
          <WalletMinimal className="text-primary" />
          {isExpanded && (
            <h1 className="text-lg ml-4 inline md:hidden lg:inline font-bold">
              Trackwise
            </h1>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup className="px-4 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <>
                      {screenWidth > 767 && screenWidth < 1024 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                className="hidden md:block lg:hidden"
                                variant={active === item.name ? "default" : "ghost"}
                                onClick={() => router.push(item.path)} // Ensure you're using `router.push` for navigation
                              >
                                <item.icon
                                  style={{ width: "20px", height: "20px" }}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={5}
                              className="p-2 px-4 rounded-lg shadow-md bg-primary text-black"
                            >
                              <p className="tracking-wide">{item.name}</p>
                              <TooltipArrow className="fill-white"/>{" "}
                              {/* Add styles to customize the arrow */}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Button
                          onClick={() => {
                            setActive(item.name);
                            router(item.path);
                          }}
                          variant={active === item.name ? "default" : "ghost"}
                          className="lg:flex text-md px-3 lg:p-3 justify-start lg:w-full h-[42px] rounded w-[100%]"
                        >
                          <item.icon
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span className="inline md:hidden lg:inline">
                            {item.name}
                          </span>
                        </Button>
                      )}
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <div className="mx-3 py-3">
          <SidebarMenuButton asChild>
            <Button
              variant={"ghost"}
              className="lg:flex text-md px-3 lg:p-3 justify-start lg:w-full h-[42px] rounded w-[100%]"
              onClick={handleLogout}
            >
              <LogOut
                style={{ width: "24px", height: "24px" }}
                className="lg:mr-3"
              />
              <span className="inline md:hidden lg:inline">Logout</span>
            </Button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
