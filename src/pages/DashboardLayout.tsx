import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Bell } from "lucide-react";
import { useEffect } from "react";

const DashboardLayout = () => {
  const { admin, isAuthenticated, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!admin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {location.pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ")).join(" / ") || "Overview"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => navigate("/dashboard/notifications")}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {admin.firstName[0]}
                </div>
                <span className="text-sm font-medium text-foreground hidden md:inline">{admin.firstName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/login"); }} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
