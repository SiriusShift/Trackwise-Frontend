import { AppSidebar } from "@/shared/components/Sidebar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { QuickActionsProvider } from "@/shared/quick-actions/QuickActionsProvider";
import { Outlet } from "react-router-dom";
import Header from "../shared/components/Header";

function MainLayout() {
  return (
    <SidebarProvider>
      <QuickActionsProvider>
        <AppSidebar />
        {/* Own scroll container so the scrollbar overlays the content
            (absolutely positioned) instead of taking layout width.
            Radix wraps children in a display:table div, which stops them
            shrinking (breaks truncate/grids), so force it back to block. */}
        <ScrollArea className="flex-1 min-w-0 h-svh [&>[data-radix-scroll-area-viewport]>div]:block!">
          <Header />
          <div>
            <Outlet />
          </div>
        </ScrollArea>
      </QuickActionsProvider>
    </SidebarProvider>
  );
}

export default MainLayout;
