import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarCheck, Search, Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockAttendance = [
  { id: 1, userName: "Jean Baptiste", method: "card", status: "check_in", timestamp: "2026-03-23 08:02:00", device: "Main Gate" },
  { id: 2, userName: "Marie Claire", method: "fingerprint", status: "check_in", timestamp: "2026-03-23 08:05:00", device: "Main Gate" },
  { id: 3, userName: "Emmanuel N.", method: "card", status: "check_in", timestamp: "2026-03-23 08:10:00", device: "Library" },
  { id: 4, userName: "Jean Baptiste", method: "card", status: "check_out", timestamp: "2026-03-23 17:00:00", device: "Main Gate" },
  { id: 5, userName: "Diane Uwase", method: "backup_code", status: "check_in", timestamp: "2026-03-23 08:30:00", device: "Lab A" },
];

const AttendanceManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockAttendance.filter(a => {
    const matchSearch = a.userName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><CalendarCheck className="h-6 w-6 text-primary" /> Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage attendance records.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="check_in">Check In</SelectItem>
                <SelectItem value="check_out">Check Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>User</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Time</TableHead><TableHead>Device</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-foreground">{a.userName}</TableCell>
                  <TableCell><Badge variant="secondary">{a.method}</Badge></TableCell>
                  <TableCell>
                    <Badge className={a.status === "check_in" ? "bg-success/10 text-success border-0" : "bg-warning/10 text-warning border-0"}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{a.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
