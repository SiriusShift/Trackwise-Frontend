import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/shared/components/Sidebar";
import Header from "../shared/components/Header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

function MainLayout() {
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <div>
            <Outlet />
          </div>
        </div>
    </SidebarProvider>
  );
}

export default MainLayout;
