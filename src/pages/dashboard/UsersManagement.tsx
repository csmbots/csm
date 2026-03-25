import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Trash2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockUsers = [
  { id: 1, firstName: "Jean", lastName: "Baptiste", email: "jean@school.rw", role: "student", cardUid: "9D979A88", isActive: true, department: "S1 Science" },
  { id: 2, firstName: "Marie", lastName: "Claire", email: "marie@school.rw", role: "student", cardUid: "AB12CD34", isActive: true, department: "S2 Arts" },
  { id: 3, firstName: "Emmanuel", lastName: "Nsabimana", email: "emma@company.rw", role: "employee", cardUid: "EF56GH78", isActive: true, department: "Engineering" },
  { id: 4, firstName: "Diane", lastName: "Uwase", email: "diane@school.rw", role: "student", cardUid: "IJ90KL12", isActive: false, department: "S3 MPC" },
  { id: 5, firstName: "Patrick", lastName: "Niyonzima", email: "pat@company.rw", role: "employee", cardUid: "MN34OP56", isActive: true, department: "HR" },
];

const UsersManagement = () => {
  const { admin } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const tabs = admin?.organizationType === "company"
    ? [
        { view: "list", label: "Users List" },
        { view: "departments", label: "Department" },
        { view: "categories", label: "Category" },
      ]
    : [
        { view: "list", label: "Users List" },
        { view: "trades", label: "Trades" },
        { view: "classes", label: "Classes" },
      ];

  const selectedView = searchParams.get("view") || "list";
  const activeView = tabs.some((tab) => tab.view === selectedView) ? selectedView : "list";

  const filtered = mockUsers.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.cardUid}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const scopedUsers = useMemo(() => {
    if (activeView === "departments" || activeView === "classes") {
      return filtered.filter((u) => /S\d|Science|Arts|MPC/i.test(u.department));
    }

    if (activeView === "categories" || activeView === "trades") {
      return filtered.filter((u) => /Engineering|HR|employee/i.test(`${u.department} ${u.role}`));
    }

    return filtered;
  }, [activeView, filtered]);

  const grouped = useMemo(() => {
    return scopedUsers.reduce<Record<string, number>>((acc, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1;
      return acc;
    }, {});
  }, [scopedUsers]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Users Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{tabs.find((tab) => tab.view === activeView)?.label} segment.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add User</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button key={tab.view} asChild variant={activeView === tab.view ? "default" : "outline"} className={activeView === tab.view ? "gradient-primary text-primary-foreground" : ""}>
            <Link to={`/dashboard/users?view=${tab.view}`}>{tab.label}</Link>
          </Button>
        ))}
      </div>

      {activeView !== "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(grouped).map(([name, count]) => (
            <Card key={name} className="border border-border/60 bg-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{name}</p>
                <p className="text-2xl font-heading font-bold text-foreground">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, card UID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Card UID</TableHead><TableHead>Dept/Class</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {scopedUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">{u.firstName[0]}{u.lastName[0]}</div>
                      {u.firstName} {u.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant={u.role === "student" ? "secondary" : "default"} className={u.role === "student" ? "" : "gradient-primary text-primary-foreground border-0"}>{u.role}</Badge></TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{u.cardUid}</TableCell>
                  <TableCell className="text-muted-foreground">{u.department}</TableCell>
                  <TableCell><span className={`inline-flex items-center gap-1 text-xs font-medium ${u.isActive ? "text-success" : "text-destructive"}`}><span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-success" : "bg-destructive"}`} />{u.isActive ? "Active" : "Inactive"}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
