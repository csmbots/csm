import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Cpu, CalendarCheck, Building2, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const attendanceData = [
  { day: "Mon", present: 420, absent: 30 }, { day: "Tue", present: 435, absent: 15 },
  { day: "Wed", present: 410, absent: 40 }, { day: "Thu", present: 440, absent: 10 },
  { day: "Fri", present: 400, absent: 50 },
];

const deviceData = [
  { name: "Online", value: 12 }, { name: "Offline", value: 3 },
];
const COLORS = ["hsl(212,100%,50%)", "hsl(0,0%,75%)"];

const recentAttendance = [
  { name: "Jean Baptiste", time: "08:02 AM", status: "check_in", method: "card" },
  { name: "Marie Claire", time: "08:05 AM", status: "check_in", method: "fingerprint" },
  { name: "Emmanuel", time: "08:10 AM", status: "check_in", method: "card" },
  { name: "Diane Uwase", time: "08:12 AM", status: "check_in", method: "card" },
  { name: "Patrick Niyonzima", time: "08:15 AM", status: "check_in", method: "fingerprint" },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,248" icon={Users} change="12% from last month" positive />
        <StatCard title="Active Devices" value="15" icon={Cpu} change="2 new this week" positive />
        <StatCard title="Today's Attendance" value="92%" icon={CalendarCheck} change="3% from yesterday" positive />
        <StatCard title="Departments" value="8" icon={Building2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm bg-card">
          <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Weekly Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="present" fill="hsl(212,100%,50%)" radius={[4,4,0,0]} />
                <Bar dataKey="absent" fill="hsl(0,84%,60%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Device Status</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={5}>
                {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary" /> Online (12)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-muted-foreground" /> Offline (3)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Recent Attendance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttendance.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {a.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div><p className="text-sm font-medium text-foreground">{a.name}</p><p className="text-xs text-muted-foreground">{a.method}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{a.time}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">{a.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
