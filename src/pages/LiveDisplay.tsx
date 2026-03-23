import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Users, Clock } from "lucide-react";

const mockLiveData = [
  { id: 1, name: "Jean Baptiste", role: "student", class: "S1 Science", image: null, time: "08:02 AM", method: "card" },
  { id: 2, name: "Marie Claire", role: "student", class: "S2 Arts", image: null, time: "08:05 AM", method: "fingerprint" },
  { id: 3, name: "Emmanuel Nsabimana", role: "employee", class: "Engineering", image: null, time: "08:10 AM", method: "card" },
  { id: 4, name: "Diane Uwase", role: "student", class: "S3 MPC", image: null, time: "08:12 AM", method: "card" },
  { id: 5, name: "Patrick Niyonzima", role: "employee", class: "HR", image: null, time: "08:15 AM", method: "fingerprint" },
];

const LiveDisplay = () => {
  const { orgSlug } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latestEntry, setLatestEntry] = useState(mockLiveData[0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let idx = 0;
    const cycle = setInterval(() => {
      idx = (idx + 1) % mockLiveData.length;
      setLatestEntry(mockLiveData[idx]);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-primary p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-primary-foreground font-heading font-bold text-xl">CSM Live Attendance</h1>
            <p className="text-primary-foreground/70 text-sm">{orgSlug || "Demo Organization"}</p>
          </div>
        </div>
        <div className="text-right text-primary-foreground">
          <div className="text-2xl font-heading font-bold">{currentTime.toLocaleTimeString()}</div>
          <div className="text-sm opacity-70">{currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
      </header>

      {/* Main display */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Featured latest entry */}
        <Card className="border-0 shadow-xl bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="gradient-primary p-8 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground text-3xl font-heading font-bold">
                  {latestEntry.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 bg-success rounded-full animate-pulse-dot" />
                  <span className="text-sm text-success font-medium">Just checked in</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-foreground">{latestEntry.name}</h2>
                <p className="text-lg text-muted-foreground mt-1">{latestEntry.class} • {latestEntry.role}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {latestEntry.time}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{latestEntry.method}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent entries grid */}
        <div>
          <h3 className="font-heading font-bold text-foreground text-lg mb-3 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" /> Recent Entries
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {mockLiveData.map(entry => (
              <Card key={entry.id} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-lg font-bold mx-auto mb-2">
                    {entry.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h4 className="font-heading font-semibold text-foreground text-sm truncate">{entry.name}</h4>
                  <p className="text-xs text-muted-foreground">{entry.class}</p>
                  <p className="text-xs text-primary mt-1">{entry.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Today", value: "432", icon: Users },
            { label: "Attendance Rate", value: "92%", icon: CalendarCheck },
            { label: "Last Scan", value: latestEntry.time, icon: Clock },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-heading font-bold text-foreground">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <footer className="text-center p-3 text-xs text-muted-foreground border-t border-border">
        Powered by <strong className="text-primary">CSM Platform</strong> by <a href="https://cwanda.site" className="text-primary hover:underline" target="_blank">Cwanda</a>
      </footer>
    </div>
  );
};

export default LiveDisplay;
