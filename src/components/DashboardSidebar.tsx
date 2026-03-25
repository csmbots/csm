import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  CalendarCheck,
  Users,
  Cpu,
  Settings,
  MonitorSmartphone,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Rocket,
  LogOut,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const primaryLinks = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Attendance", url: "/dashboard/attendance", icon: CalendarCheck },
  { title: "Devices", url: "/dashboard/devices", icon: Cpu },
];

const analyticsSubTabs = [
  { title: "Users", view: "users" },
  { title: "Attendance", view: "attendance" },
  { title: "Devices", view: "devices" },
  { title: "Subscription", view: "subscription" },
];

const companyUserTabs = [
  { title: "Users List", view: "list" },
  { title: "Department", view: "departments" },
  { title: "Category", view: "categories" },
];

const educationUserTabs = [
  { title: "Users List", view: "list" },
  { title: "Trades", view: "trades" },
  { title: "Classes", view: "classes" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const analyticsView = query.get("view") || "users";
  const usersView = query.get("view") || "list";

  const analyticsActive = location.pathname.startsWith("/dashboard/analytics");
  const usersActive = location.pathname.startsWith("/dashboard/users");

  const [analyticsOpen, setAnalyticsOpen] = useState(analyticsActive);
  const [usersOpen, setUsersOpen] = useState(usersActive);

  useEffect(() => {
    if (analyticsActive) setAnalyticsOpen(true);
    if (usersActive) setUsersOpen(true);
  }, [analyticsActive, usersActive]);

  const userSubTabs = admin?.organizationType === "company" ? companyUserTabs : educationUserTabs;

  const linkClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors";

  const renderPrimaryLinks = () => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {primaryLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/dashboard"}
                  className={linkClasses}
                  activeClassName="bg-primary/15 text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem className="relative">
            <SidebarMenuButton
              isActive={analyticsActive}
              onClick={() => navigate("/dashboard/analytics?view=users")}
              className="flex items-center gap-3"
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Analytics</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnalyticsOpen((prev) => !prev);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {analyticsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </>
              )}
            </SidebarMenuButton>

            {!collapsed && analyticsOpen && (
              <SidebarMenuSub>
                {analyticsSubTabs.map((tab) => (
                  <SidebarMenuSubItem key={tab.view}>
                    <SidebarMenuSubButton asChild isActive={analyticsActive && analyticsView === tab.view}>
                      <Link to={`/dashboard/analytics?view=${tab.view}`}>{tab.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          <SidebarMenuItem className="relative">
            <SidebarMenuButton
              isActive={usersActive}
              onClick={() => navigate("/dashboard/users?view=list")}
              className="flex items-center gap-3"
            >
              <Users className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Users</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUsersOpen((prev) => !prev);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {usersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </>
              )}
            </SidebarMenuButton>

            {!collapsed && usersOpen && (
              <SidebarMenuSub>
                {userSubTabs.map((tab) => (
                  <SidebarMenuSubItem key={tab.view}>
                    <SidebarMenuSubButton asChild isActive={usersActive && usersView === tab.view}>
                      <Link to={`/dashboard/users?view=${tab.view}`}>{tab.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border bg-sidebar-accent/60">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <span className="text-primary-foreground font-heading font-bold text-lg">CS</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-sidebar-foreground text-sm truncate">CSM</h2>
            <p className="text-[10px] text-muted-foreground truncate">{admin?.organizationName || "Organization"}</p>
          </div>
        )}
      </div>

      <SidebarContent className="px-2 py-3 flex-1">
        {renderPrimaryLinks()}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">Config</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/settings"
                    end
                    className={linkClasses}
                    activeClassName="bg-primary/15 text-primary font-medium"
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/device-config"
                    end
                    className={linkClasses}
                    activeClassName="bg-primary/15 text-primary font-medium"
                  >
                    <MonitorSmartphone className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Device</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/billing"
                    end
                    className={linkClasses}
                    activeClassName="bg-primary/15 text-primary font-medium"
                  >
                    <CreditCard className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Subscription</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t border-sidebar-border px-3 py-3 space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-xl gradient-primary text-primary-foreground shadow-md">
            <div className="flex items-start gap-2">
              <Rocket className="h-4 w-4 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Upgrade Plan</p>
                <p className="text-xs text-primary-foreground/80">Get access to all features</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <Progress value={46} className="h-1.5 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
              <button
                type="button"
                className="w-full rounded-full bg-primary-foreground text-primary text-sm font-semibold py-1.5 hover:opacity-90 transition-opacity"
                onClick={() => navigate("/dashboard/billing")}
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        <Button
          className={cn(
            "w-full justify-start gap-2 bg-secondary text-destructive hover:bg-secondary/85",
            collapsed && "justify-center px-0",
          )}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>

        {!collapsed && (
          <button
            type="button"
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate("/dashboard/billing")}
          >
            Manage Subscription
          </button>
        )}
      </div>
    </Sidebar>
  );
}
