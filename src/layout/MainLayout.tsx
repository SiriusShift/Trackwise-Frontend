import { AppSidebar } from "@/shared/components/Sidebar";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { QuickActionsProvider } from "@/shared/quick-actions/QuickActionsProvider";
import { Outlet } from "react-router-dom";
import Header from "../shared/components/Header";

function MainLayout() {
  return (
    <SidebarProvider>
      <QuickActionsProvider>
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <div className="pb-24">
            <Outlet />
          </div>
        </div>
      </QuickActionsProvider>
    </SidebarProvider>
  );
}

export default MainLayout;
