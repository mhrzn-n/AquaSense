import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import LeftSideBar from "./LeftSideBar";
import DashboardHeader from "../../components/DashboardHeader";

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="relative flex h-screen bg-slate-50 overflow-hidden">
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <LeftSideBar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileLinkClick={closeMobileSidebar}
        onMobileClose={closeMobileSidebar}
      />

      <div className={`flex flex-1 flex-col min-w-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="flex items-center justify-between px-4 py-4 md:hidden shrink-0">
          {/* smaller device menu */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
        <div className="shrink-0">
          <DashboardHeader />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-10 md:px-6 md:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
