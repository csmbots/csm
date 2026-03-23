import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { BarChart3, Users, Cpu, CalendarCheck } from "lucide-react";

const monthlyData = [
  { month: "Jan", attendance: 89 }, { month: "Feb", attendance: 92 }, { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 95 }, { month: "May", attendance: 91 }, { month: "Jun", attendance: 93 },
];
const userGrowth = [
  { month: "Jan", users: 800 }, { month: "Feb", users: 920 }, { month: "Mar", users: 1050 },
  { month: "Apr", users: 1100 }, { month: "May", users: 1180 }, { month: "Jun", users: 1248 },
];
const methodData = [
  { name: "Card", value: 65 }, { name: "Fingerprint", value: 30 }, { name: "Backup Code", value: 5 },
];
const COLORS = ["hsl(212,100%,50%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)"];

const Analytics = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Analytics</h1>
      <p className="text-muted-foreground text-sm mt-1">Detailed insights into your organization's data.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" /> Monthly Attendance Rate</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80,100]} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="attendance" stroke="hsl(212,100%,50%)" fill="hsl(212,100%,50%)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> User Growth</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowth}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="users" stroke="hsl(142,76%,36%)" strokeWidth={2} dot={{ fill: "hsl(142,76%,36%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading text-foreground flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> Attendance Method</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={methodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {methodData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie></PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-sm mt-2">
            {methodData.map((d, i) => <span key={i} className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />{d.name} ({d.value}%)</span>)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading text-foreground">Peak Hours</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { hour: "7AM", count: 45 }, { hour: "8AM", count: 320 }, { hour: "9AM", count: 180 },
              { hour: "12PM", count: 90 }, { hour: "1PM", count: 85 }, { hour: "5PM", count: 290 }, { hour: "6PM", count: 120 },
            ]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(212,100%,50%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Analytics;
