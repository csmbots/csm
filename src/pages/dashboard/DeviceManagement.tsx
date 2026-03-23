import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, Plus, MapPin, Wifi, WifiOff, Settings2 } from "lucide-react";

const mockDevices = [
  { id: 1, name: "Main Gate Scanner", uid: "ESP32-001A", type: "ESP32", status: "active", isOnline: true, lastSeen: "2 min ago", location: "Main Entrance" },
  { id: 2, name: "Library Scanner", uid: "ESP32-002B", type: "ESP32", status: "active", isOnline: true, lastSeen: "5 min ago", location: "Library" },
  { id: 3, name: "Lab A Scanner", uid: "ESP8266-003C", type: "ESP8266", status: "active", isOnline: false, lastSeen: "2 hours ago", location: "Lab A" },
  { id: 4, name: "Cafeteria Scanner", uid: "ESP32-004D", type: "ESP32", status: "active", isOnline: true, lastSeen: "1 min ago", location: "Cafeteria" },
  { id: 5, name: "Staff Room", uid: "ESP32-005E", type: "ESP32", status: "inactive", isOnline: false, lastSeen: "3 days ago", location: "Staff Room" },
];

const DeviceManagement = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><Cpu className="h-6 w-6 text-primary" /> Device Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor and manage all ESP devices in your organization.</p>
      </div>
      <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add Device</Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockDevices.map(d => (
        <Card key={d.id} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="font-heading text-foreground text-base">{d.name}</CardTitle>
              {d.isOnline ? <Badge className="bg-success/10 text-success border-0"><Wifi className="h-3 w-3 mr-1" />Online</Badge>
                : <Badge variant="secondary" className="text-muted-foreground"><WifiOff className="h-3 w-3 mr-1" />Offline</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Device ID</span><span className="font-mono text-foreground">{d.uid}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{d.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Seen</span><span className="text-foreground">{d.lastSeen}</span></div>
              <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{d.location}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><Settings2 className="h-3 w-3 mr-1" />Configure</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default DeviceManagement;
