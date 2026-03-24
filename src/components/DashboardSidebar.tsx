import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, BarChart3, CalendarCheck, Users, Cpu, Settings, Wifi, MonitorSmartphone,
  Bell, FileText, CreditCard, UserCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const primaryLinks = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Attendance", url: "/dashboard/attendance", icon: CalendarCheck },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Devices", url: "/dashboard/devices", icon: Cpu },
];

const configLinks = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Device Config", url: "/dashboard/device-config", icon: MonitorSmartphone },
  { title: "Wi-Fi Config", url: "/dashboard/wifi-config", icon: Wifi },
];

const moreLinks = [
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const renderGroup = (label: string, links: typeof primaryLinks) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === "/dashboard"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  activeClassName="bg-primary/10 text-primary font-medium">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const isSettingsActive = location.pathname === "/dashboard/settings";
  const isBillingActive = location.pathname === "/dashboard/billing";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <span className="text-primary-foreground font-heading font-bold text-lg">C</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-sidebar-foreground text-sm truncate">CSM Platform</h2>
            <p className="text-[10px] text-muted-foreground truncate">{admin?.organizationName}</p>
          </div>
        )}
      </div>
      <SidebarContent className="px-2 py-3 flex-1">
        {renderGroup("Main", primaryLinks)}
        {renderGroup("Configuration", configLinks)}
        {renderGroup("More", moreLinks)}
      </SidebarContent>

      {/* Bottom section: Settings + Billing */}
      <div className="border-t border-sidebar-border px-2 py-2 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/dashboard/settings" end
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium">
                <Settings className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/dashboard/billing" end
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium">
                <CreditCard className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Billing</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Free trial indicator */}
        {!collapsed && (
          <div className="mx-2 mt-2 mb-1 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-foreground">Free Trial</p>
            <p className="text-xs text-muted-foreground mb-2">14 days left</p>
            <Progress value={53} className="h-1.5 bg-muted [&>div]:gradient-primary" />
            <button
              onClick={() => navigate("/dashboard/billing")}
              className="mt-2 w-full text-xs font-medium text-center py-1.5 rounded-md gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Upgrade plan
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
