import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const mockWifi = [
  { id: 1, deviceName: "Main Gate Scanner", ssid: "SchoolNet_5G", password: "s3cur3p@ss", api: "https://api.csm.cwanda.site/v1/verify" },
  { id: 2, deviceName: "Library Scanner", ssid: "SchoolNet_5G", password: "s3cur3p@ss", api: "https://api.csm.cwanda.site/v1/verify" },
  { id: 3, deviceName: "Lab A Scanner", ssid: "LabNetwork", password: "l@bp@ss123", api: "https://api.csm.cwanda.site/v1/verify" },
];

const WifiConfig = () => {
  const [showPass, setShowPass] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><Wifi className="h-6 w-6 text-primary" /> Wi-Fi Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">View stored Wi-Fi credentials for each ESP device.</p>
      </div>
      {mockWifi.map(w => (
        <Card key={w.id} className="border-0 shadow-sm bg-card">
          <CardHeader><CardTitle className="font-heading text-base">{w.deviceName}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">SSID</span><span className="font-mono text-foreground">{w.ssid}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Password</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-foreground">{showPass[w.id] ? w.password : "••••••••"}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPass(p => ({ ...p, [w.id]: !p[w.id] }))}>
                  {showPass[w.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">API URL</span><span className="font-mono text-foreground text-xs break-all">{w.api}</span></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WifiConfig;
