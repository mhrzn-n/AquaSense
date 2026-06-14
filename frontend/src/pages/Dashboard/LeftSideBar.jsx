import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  BellDot,
  LineChart,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Wallet2Icon,
} from "lucide-react";

const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Alerts",
    icon: BellDot,
    to: "/dashboard/alerts",
  },
  {
    label: "Analytics",
    icon: LineChart,
    to: "/dashboard/analytics",
  },
  {
    label: "Reports",
    icon: FileText,
    to: "/dashboard/reports",
  },
  {
    label: "Subscription",
    icon: Wallet2Icon,
    to: "/dashboard/subscription",
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/dashboard/settings",
  },
];

const LeftSideBar = ({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  // onMobileClose,
  onMobileLinkClick,
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const token = Cookies.get("authToken");

    try {
      await axios.post(
        "https://AquaSense.onrender.com/api/auth/logout",
        {},
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      Cookies.remove("authToken");
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  const isCompact = isCollapsed;

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onMobileLinkClick?.();
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen border-r border-slate-200 bg-white/90 backdrop-blur transition-all duration-300 z-30 ${
          isCompact ? "w-20" : "w-64"
        }`}
      >
        <div className={`px-4 py-4 ${isCompact ? "text-center" : "px-6"} flex-1 flex flex-col`}>
          <div className="flex items-center justify-between shrink-0">
            <p
              className={`font-semibold uppercase text-slate-900 ${
                isCompact ? "text-lg" : "text-2xl tracking-wide"
              }`}
            >
              {isCompact ? "H₂O" : "H₂Otronics"}
            </p>
            <button
              type="button"
              onClick={toggleCollapse}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            >
              {isCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
          <nav className="mt-8 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-100",
                      isCompact ? "justify-center" : "",
                    ].join(" ")
                  }
                  end={item.to === "/dashboard"}
                >
                  <Icon size={18} />
                  {!isCompact && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
          <div className={`mt-auto pb-6 ${isCompact ? "px-4" : "px-6"} shrink-0`}>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white bg-linear-to-r from-slate-900 via-blue-900 to-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition disabled:opacity-60 ${
                isCompact ? "w-12 h-12" : "w-full px-4 py-3"
              }`}
            >
              <LogOut size={18} />
              {!isCompact && (isLoggingOut ? "Signing out..." : "Logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white/90 backdrop-blur transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold tracking-wide uppercase text-slate-900">
              H₂Otronics
            </p>
            {/* <button
              type="button"
              onClick={onMobileClose}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <PanelLeftClose size={18} />
            </button> */}
          </div>
          <nav className="mt-8 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")
                  }
                  end={item.to === "/dashboard"}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="px-6 pb-6 mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-slate-900 via-blue-900 to-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition disabled:opacity-60"
          >
            <LogOut size={18} />
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default LeftSideBar;
