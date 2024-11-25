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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useNavigate();

  const handleLogout = () => {
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
        <SidebarGroup className="px-5 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationData.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <div onClick={() => router(item.path)} className="flex items-center hover:cursor-pointer h-[42px] space-x-2">
                      <item.icon style={{ width: "24px", height: "24px" }} />
                      <span className="inline md:hidden lg:inline">
                        {item.name}
                      </span>
                      {!isExpanded && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <button
                                className="hidden md:block"
                                onClick={() => router(item.path)}
                              >
                                <item.icon
                                  style={{ width: "20px", height: "20px" }}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
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
            <button
              className="flex items-center h-[42px] rounded w-[100%] px-2 space-x-2"
              onClick={handleLogout}
            >
              <LogOut
                style={{ width: "24px", height: "24px" }}
                className="lg:mr-3"
              />
              <span className="inline md:hidden lg:inline">Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
