import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CalendarCheck, Search, Download, Plus, Clock, Edit, Trash2,
  RefreshCw, Users, BarChart3, UserPlus
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* ─── Types ─── */
interface AttendanceRecord {
  id: number;
  userName: string;
  method: "card" | "backup_code" | "fingerprint" | "manual" | "face_recognition";
  status: "check_in" | "check_out" | "present" | "absent" | "late" | "early_leave" | "holiday" | "weekend";
  timestamp: string;
  device: string;
  attendanceType?: string;
}

interface Schedule {
  id: number;
  name: string;
  description: string;
  type: "check_in" | "check_out" | "both";
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  isActive: boolean;
  targetType: "all" | "departments" | "positions" | "sections" | "classes";
  targetIds: number[];
}

/* ─── Mock data ─── */
const mockRecords: AttendanceRecord[] = [
  { id: 1, userName: "Jean Baptiste", method: "card", status: "check_in", timestamp: "2026-04-09 08:02:00", device: "Main Gate" },
  { id: 2, userName: "Marie Claire", method: "fingerprint", status: "check_in", timestamp: "2026-04-09 08:05:00", device: "Main Gate" },
  { id: 3, userName: "Emmanuel N.", method: "card", status: "late", timestamp: "2026-04-09 08:35:00", device: "Library" },
  { id: 4, userName: "Jean Baptiste", method: "card", status: "check_out", timestamp: "2026-04-09 17:00:00", device: "Main Gate" },
  { id: 5, userName: "Diane Uwase", method: "backup_code", status: "check_in", timestamp: "2026-04-09 08:30:00", device: "Lab A" },
  { id: 6, userName: "Patrick K.", method: "manual", status: "absent", timestamp: "2026-04-09 08:00:00", device: "—" },
];

const mockSchedules: Schedule[] = [];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL: Record<string, string> = {
  Mon: "monday", Tue: "tuesday", Wed: "wednesday", Thu: "thursday",
  Fri: "friday", Sat: "saturday", Sun: "sunday",
};

const statusColor: Record<string, string> = {
  check_in: "bg-success/10 text-success",
  check_out: "bg-info/10 text-info",
  present: "bg-success/10 text-success",
  absent: "bg-destructive/10 text-destructive",
  late: "bg-warning/10 text-warning",
  early_leave: "bg-warning/10 text-warning",
  holiday: "bg-muted text-muted-foreground",
  weekend: "bg-muted text-muted-foreground",
};

/* ──────────────────────────── Component ──────────────────────────── */

const AttendanceManagement = () => {
  const { admin } = useAuth();
  const orgType = admin?.organizationType ?? "school";

  /* Records state */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  /* Schedule state */
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  /* Schedule form */
  const [schName, setSchName] = useState("");
  const [schDesc, setSchDesc] = useState("");
  const [schType, setSchType] = useState<"check_in" | "check_out" | "both">("both");
  const [schStart, setSchStart] = useState("08:00");
  const [schEnd, setSchEnd] = useState("17:00");
  const [schDays, setSchDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [schActive, setSchActive] = useState(true);
  const [schTarget, setSchTarget] = useState<Schedule["targetType"]>("all");
  const [schSubTarget, setSchSubTarget] = useState<string>("");

  /* Manual attendance */
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualUser, setManualUser] = useState("");
  const [manualStatus, setManualStatus] = useState<"check_in" | "check_out">("check_in");
  const [manualNote, setManualNote] = useState("");

  /* ─── Filters ─── */
  const filtered = mockRecords.filter(a => {
    const matchSearch = a.userName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchMethod = methodFilter === "all" || a.method === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  /* ─── Schedule helpers ─── */
  const resetScheduleForm = () => {
    setSchName(""); setSchDesc(""); setSchType("both");
    setSchStart("08:00"); setSchEnd("17:00");
    setSchDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setSchActive(true); setSchTarget("all"); setSchSubTarget("");
    setEditingSchedule(null);
  };

  const openNewSchedule = () => { resetScheduleForm(); setShowScheduleDialog(true); };

  const openEditSchedule = (s: Schedule) => {
    setEditingSchedule(s);
    setSchName(s.name); setSchDesc(s.description); setSchType(s.type);
    setSchStart(s.startTime); setSchEnd(s.endTime);
    setSchDays(s.daysOfWeek.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)));
    setSchActive(s.isActive); setSchTarget(s.targetType); setSchSubTarget("");
    setShowScheduleDialog(true);
  };

  const saveSchedule = () => {
    if (!schName.trim()) { toast.error("Schedule name is required"); return; }
    const data: Schedule = {
      id: editingSchedule?.id ?? Date.now(),
      name: schName, description: schDesc, type: schType,
      startTime: schStart, endTime: schEnd,
      daysOfWeek: schDays.map(d => DAY_FULL[d]),
      isActive: schActive, targetType: schTarget, targetIds: [],
    };
    if (editingSchedule) {
      setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? data : s));
      toast.success("Schedule updated");
    } else {
      setSchedules(prev => [...prev, data]);
      toast.success("Schedule created");
    }
    setShowScheduleDialog(false); resetScheduleForm();
  };

  const deleteSchedule = (id: number) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success("Schedule deleted");
  };

  const toggleDay = (d: string) => {
    setSchDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const submitManualAttendance = () => {
    if (!manualUser.trim()) { toast.error("Select a user"); return; }
    toast.success(`Manual ${manualStatus.replace("_", " ")} recorded for ${manualUser}`);
    setShowManualDialog(false); setManualUser(""); setManualNote("");
  };

  /* ─── Stats ─── */
  const totalToday = mockRecords.length;
  const checkIns = mockRecords.filter(r => r.status === "check_in" || r.status === "present" || r.status === "late").length;
  const absents = mockRecords.filter(r => r.status === "absent").length;
  const lates = mockRecords.filter(r => r.status === "late").length;

  /* ─── Target type options ─── */
  const targetOptions = orgType === "company"
    ? [{ value: "all", label: "All Users" }, { value: "departments", label: "Department" }, { value: "positions", label: "Position" }]
    : [{ value: "all", label: "All Users" }, { value: "departments", label: "Department" }, { value: "positions", label: "Position" }, { value: "sections", label: "Section / Trade" }, { value: "classes", label: "Class" }];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" /> Attendance Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track attendance records, manage schedules, and view statistics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Refreshing...")}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setShowManualDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Manual Attendance
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={openNewSchedule}>
            <Plus className="h-4 w-4 mr-1" /> New Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* ─── Schedules Section ─── */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Attendance Schedules ({schedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No schedules created. Click "New Schedule" to create one.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map(s => (
                <Card key={s.id} className="border bg-accent/30">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-semibold text-foreground">{s.name}</span>
                      <Badge variant={s.isActive ? "default" : "secondary"}>
                        {s.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.description || "No description"}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {s.startTime} – {s.endTime}
                      <Badge variant="outline" className="text-[10px] ml-auto capitalize">{s.type.replace("_", " & ")}</Badge>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {DAYS.map(d => (
                        <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          s.daysOfWeek.includes(DAY_FULL[d])
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>{d}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEditSchedule(s)}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => deleteSchedule(s.id)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Tabs: Records / Statistics ─── */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Records Tab */}
        <TabsContent value="records">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="check_in">Check In</SelectItem>
                    <SelectItem value="check_out">Check Out</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="early_leave">Early Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="fingerprint">Fingerprint</SelectItem>
                    <SelectItem value="backup_code">Backup Code</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="face_recognition">Face</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium text-foreground">{a.userName}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{a.method.replace("_", " ")}</Badge></TableCell>
                        <TableCell>
                          <Badge className={`${statusColor[a.status] ?? "bg-muted text-muted-foreground"} border-0 capitalize`}>
                            {a.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{a.device}</TableCell>
                        <TableCell className="text-muted-foreground">{a.attendanceType ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{totalToday}</p>
                  <p className="text-xs text-muted-foreground">Total Records Today</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{checkIns}</p>
                  <p className="text-xs text-muted-foreground">Checked In</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{absents}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{lates}</p>
                  <p className="text-xs text-muted-foreground">Late Arrivals</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm bg-card mt-4">
            <CardContent className="p-8 text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading font-semibold text-foreground">Charts coming soon</p>
              <p className="text-sm">Daily, weekly, and monthly attendance trends will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── Create / Edit Schedule Dialog ─── */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingSchedule ? "Edit Attendance Schedule" : "Create Attendance Schedule"}
            </DialogTitle>
            <DialogDescription>
              Define when attendance should be tracked and for which users.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label>Schedule Name *</Label>
              <Input placeholder="e.g., Morning Check-in, Office Hours" value={schName} onChange={e => setSchName(e.target.value)} />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Optional description" rows={2} value={schDesc} onChange={e => setSchDesc(e.target.value)} />
            </div>

            {/* Type + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Schedule Type</Label>
                <Select value={schType} onValueChange={v => setSchType(v as typeof schType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Check In & Out</SelectItem>
                    <SelectItem value="check_in">Check In Only</SelectItem>
                    <SelectItem value="check_out">Check Out Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Active Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch checked={schActive} onCheckedChange={setSchActive} />
                  <span className="text-sm text-foreground">{schActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Time</Label>
                <Input type="time" value={schStart} onChange={e => setSchStart(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>End Time</Label>
                <Input type="time" value={schEnd} onChange={e => setSchEnd(e.target.value)} />
              </div>
            </div>

            {/* Days of Week */}
            <div className="space-y-1.5">
              <Label>Days of Week *</Label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      schDays.includes(d)
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Users */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Target Users</Label>
              <Select value={schTarget} onValueChange={v => { setSchTarget(v as Schedule["targetType"]); setSchSubTarget(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {targetOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sub-select for departments */}
              {schTarget === "departments" && (
                <Select value={schSubTarget} onValueChange={setSchSubTarget}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select department..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Administration</SelectItem>
                    <SelectItem value="2">Engineering</SelectItem>
                    <SelectItem value="3">Staff</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Sub-select for positions */}
              {schTarget === "positions" && (
                <Select value={schSubTarget} onValueChange={setSchSubTarget}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select position..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Teacher</SelectItem>
                    <SelectItem value="2">Manager</SelectItem>
                    <SelectItem value="3">Cleaner</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Sub-select for sections (education only) */}
              {schTarget === "sections" && (
                <Select value={schSubTarget} onValueChange={setSchSubTarget}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select section / trade..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">MPC</SelectItem>
                    <SelectItem value="2">SOD</SelectItem>
                    <SelectItem value="3">Primary</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Sub-select for classes (education only) */}
              {schTarget === "classes" && (
                <Select value={schSubTarget} onValueChange={setSchSubTarget}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select class..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">S4B</SelectItem>
                    <SelectItem value="2">L5A</SelectItem>
                    <SelectItem value="3">P5C</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => { setShowScheduleDialog(false); resetScheduleForm(); }}>
              Cancel
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveSchedule}>
              {editingSchedule ? "Update Schedule" : "Create Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Manual Attendance Dialog ─── */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Manual Attendance</DialogTitle>
            <DialogDescription>
              Record attendance manually for a user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>User Name *</Label>
              <Input placeholder="Search or enter user name" value={manualUser} onChange={e => setManualUser(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={manualStatus} onValueChange={v => setManualStatus(v as "check_in" | "check_out")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="check_in">Check In</SelectItem>
                  <SelectItem value="check_out">Check Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Optional notes..." rows={2} value={manualNote} onChange={e => setManualNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowManualDialog(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={submitManualAttendance}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManagement;
