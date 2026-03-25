import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CreditCard, LogOut, Moon, Search, Settings, Sun, UserCircle } from "lucide-react";
import { useEffect } from "react";

const DashboardLayout = () => {
  const { admin, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/login");
      return;
    }

    if (!admin.isVerified) {
      navigate("/verify-email");
    }
  }, [admin, navigate]);

  if (!admin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-accent/80 backdrop-blur-sm px-3 sm:px-4 sticky top-0 z-30">
            <div className="h-full flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="text-muted-foreground" />

                <div className="hidden sm:flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center font-heading font-bold text-primary">
                    C
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground font-heading font-semibold truncate">{admin.organizationName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{admin.organizationType}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9 h-10 bg-card" placeholder="Search..." />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground relative"
                  onClick={() => navigate("/dashboard/notifications")}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {admin.firstName[0]}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-body">
                      <p className="font-semibold text-foreground">{admin.firstName} {admin.lastName}</p>
                      <p className="text-xs font-normal text-muted-foreground">{admin.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard/account")} className="gap-2">
                      <UserCircle className="h-4 w-4" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/billing")} className="gap-2">
                      <CreditCard className="h-4 w-4" /> Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
