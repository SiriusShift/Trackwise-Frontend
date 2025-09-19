import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/shared/components/Sidebar";
import Header from "../shared/components/Header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <div className="p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
