import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/shared/components/Sidebar";
import Header from "../shared/components/Header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <AppSidebar />
        <div className="flex flex-col w-full overflow-auto">
          <Header />
          <div className="px-5 py-5  ">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
