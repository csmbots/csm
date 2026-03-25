import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Home, IdCard, Moon, Sun } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let idx = 0;
    const cycle = setInterval(() => {
      idx = (idx + 1) % mockLiveData.length;
      setActiveIndex(idx);
      setLatestEntry(mockLiveData[idx]);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  const attendanceRate = useMemo(() => {
    const expectedPeople = 500;
    const checkedIn = 430 + activeIndex * 4;
    return Math.min(99, Math.round((checkedIn / expectedPeople) * 100));
  }, [activeIndex]);

  const handleToggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button asChild variant="ghost" size="icon" className="rounded-full bg-card/80 backdrop-blur border border-border">
          <Link to="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon" className="rounded-full bg-card/80 backdrop-blur border border-border" onClick={handleToggleTheme}>
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-28 h-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
          <IdCard className="h-10 w-10 text-foreground" />
        </div>

        <div className="relative rounded-3xl bg-card px-8 py-6 border border-border shadow-lg max-w-md w-full">
          <p className="text-lg font-heading font-bold text-foreground">Hey! Tap Your Card...</p>
          <p className="text-sm text-muted-foreground mt-1">{orgSlug || "demo-organization"}</p>

          <span className="absolute left-10 -bottom-3 w-6 h-6 bg-card border-l border-b border-border rotate-[-45deg]" />
        </div>

        <div>
          <p className="text-xl font-heading font-bold text-foreground">{latestEntry.name}</p>
          <p className="text-sm text-muted-foreground">Last scan • {latestEntry.time}</p>
        </div>

        <button className="px-8 py-2 rounded-full gradient-primary text-primary-foreground font-bold tracking-wide shadow-md">
          {latestEntry.role.toUpperCase()}
        </button>

        <div className="text-sm text-muted-foreground">
          {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="border border-border/60 bg-card/90">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground">{attendanceRate}%</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/90">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Last Scan</p>
                <p className="text-lg font-heading font-semibold text-foreground">{latestEntry.time}</p>
              </div>
              <Clock className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="text-center p-3 text-xs text-muted-foreground border-t border-border/60">
        Powered by <strong className="text-primary">CSM Platform</strong>
      </footer>
    </div>
  );
};

export default LiveDisplay;
