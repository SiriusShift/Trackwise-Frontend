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
import { WalletMinimal } from "lucide-react";
import { navigationData } from "../navigation/navigationData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useNavigate();

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
                      className="flex items-center h-[42px] space-x-2"
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
        <div
          className={`p-4 text-sm text-center text-muted transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>© 2024 Trackwise</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
