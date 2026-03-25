import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Cpu, Plus, UserRoundPlus, Users } from "lucide-react";

const studentsSummary = [
  { label: "Total", value: "2,406" },
  { label: "All boys", value: "400" },
  { label: "All girls", value: "1,006" },
];

const deviceSummary = [
  { label: "Total", value: "2" },
  { label: "Online", value: "0" },
  { label: "Offline", value: "2" },
];

const recentUsers = ["Jean", "Marie", "Anna", "Ellen", "Chris"];

const DashboardOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Company Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Track users, devices, and attendance in one place.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full gradient-primary text-primary-foreground">Live View</Button>
          <Button variant="outline" className="rounded-full"><UserRoundPlus className="h-4 w-4 mr-2" /> Add User</Button>
          <Button variant="outline" className="rounded-full"><Plus className="h-4 w-4 mr-2" /> Add Device</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-border/60 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-foreground text-3xl">Students Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {studentsSummary.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-accent/60 p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-heading font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Recent Students</p>
              <div className="flex items-center gap-2">
                {recentUsers.map((name) => (
                  <div key={name} className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center text-sm font-semibold">
                    {name[0]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground font-semibold">+</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Added in last 28 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-3xl text-foreground">Devices Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {deviceSummary.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-accent/60 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-heading font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="rounded-full">View More</Button>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-3xl text-foreground">Your Enterprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-accent/60 p-4">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-xl font-heading font-bold">Free Trial</p>
            </div>
            <div className="rounded-xl border border-border bg-accent/60 p-4">
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="text-xl font-heading font-bold">124 / 500</p>
            </div>
            <Button className="w-full rounded-full gradient-primary text-primary-foreground">Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-foreground flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" /> Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Present", value: "85%", color: "bg-success" },
              { label: "Late Arrivals", value: "7%", color: "bg-warning" },
              { label: "Absent", value: "8%", color: "bg-destructive" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  {item.label}
                </span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Anna Alexander", role: "Super admin", time: "2m ago" },
              { name: "Jean Baptiste", role: "Student", time: "8m ago" },
              { name: "Diane Uwase", role: "Staff", time: "12m ago" },
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between rounded-xl border border-border bg-accent/40 p-3">
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground">{member.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
