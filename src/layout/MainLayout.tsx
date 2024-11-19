import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
// import "../assets/styles/mainLayout.styles.scss";

function MainLayout() {
  return (
    <SidebarProvider>
    <div className="flex w-full">
      <AppSidebar />
      {/* <Sidebar /> */}
      <div className="flex flex-col w-full">
        <Header />
        <div className="h-full mx-5 py-5">
          <Outlet />
        </div>
      </div>
    </div>
    </SidebarProvider>
  );
}

export default MainLayout;