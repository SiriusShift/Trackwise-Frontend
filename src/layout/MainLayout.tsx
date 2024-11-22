import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "../components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="px-5 py-5 overflow-auto ">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
