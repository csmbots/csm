import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonitorSmartphone, Wifi, Plus } from "lucide-react";

const DeviceConfig = () => (
  <div className="space-y-6 animate-fade-in max-w-3xl">
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><MonitorSmartphone className="h-6 w-6 text-primary" /> Device Configuration</h1>
      <p className="text-muted-foreground text-sm mt-1">Connect and configure ESP devices to your organization.</p>
    </div>
    <Card className="border-0 shadow-sm bg-card">
      <CardHeader><CardTitle className="font-heading">Add New Device</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Device Name</Label><Input placeholder="e.g., Main Gate Scanner" /></div>
          <div className="space-y-1"><Label>Unique Device ID</Label><Input placeholder="e.g., ESP32-001A" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Wi-Fi SSID</Label><Input placeholder="Network name" /></div>
          <div className="space-y-1"><Label>Wi-Fi Password</Label><Input type="password" placeholder="Network password" /></div>
        </div>
        <div className="space-y-1"><Label>API Endpoint URL</Label><Input placeholder="https://api.csm.cwanda.site/v1/verify" /></div>
        <Button className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add Device</Button>
      </CardContent>
    </Card>
    <Card className="border-0 shadow-sm bg-card">
      <CardHeader><CardTitle className="font-heading flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /> Device Access Point Info</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">When an ESP device is not connected to Wi-Fi, it creates an access point named <strong className="text-foreground">CSM_Config</strong> (no password). Connect to it and visit <strong className="text-foreground">192.168.4.1</strong> to configure Wi-Fi and API settings.</p>
        <div className="p-4 rounded-lg bg-accent/50 text-sm space-y-1">
          <p><span className="text-muted-foreground">AP Name:</span> <span className="font-mono text-foreground">CSM_Config</span></p>
          <p><span className="text-muted-foreground">AP Password:</span> <span className="font-mono text-foreground">(none)</span></p>
          <p><span className="text-muted-foreground">Config URL:</span> <span className="font-mono text-foreground">http://192.168.4.1</span></p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DeviceConfig;
