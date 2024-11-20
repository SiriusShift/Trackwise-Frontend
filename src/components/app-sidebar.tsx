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
import { Button } from "./ui/button";
import { useLazyGetSignoutQuery } from "../feature/authentication/api/signinApi";


export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useNavigate();

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
          {isExpanded && <h1 className="text-lg ml-4 font-bold">Trackwise</h1>}
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
                    <button
                      className="flex items-center h-[42px] space-x-2 "
                      onClick={() => router(item.path)}
                    >
                      {item.icon && (
                        <item.icon style={{ width: "24px", height: "24px" }} />
                      )}
                      {isExpanded && <span>{item.name}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <div className="mx-3">
        <Button
          size={"lg"}
          variant={"ghost"}
          className="lg:flex text-md lg:pl-3 h-[42px] lg:justify-start lg:w-full"
          onClick={handleLogout}
        >
          <LogOut
            style={{ width: "24px", height: "24px" }}
            className="lg:mr-3"
          />
          <span>Logout</span>
        </Button>
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
