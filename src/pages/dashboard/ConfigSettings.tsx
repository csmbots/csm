import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Building2, Globe, Shield, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ConfigSettings = () => {
  const { admin } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><Settings className="h-6 w-6 text-primary" /> Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure your organization and dashboard settings.</p>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Organization Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Organization Name</Label><Input defaultValue={admin?.organizationName} /></div>
            <div className="space-y-1"><Label>Organization Type</Label><Input defaultValue={admin?.organizationType} disabled /></div>
            <div className="space-y-1"><Label>Contact Email</Label><Input type="email" defaultValue="contact@school.rw" /></div>
            <div className="space-y-1"><Label>Contact Phone</Label><Input defaultValue="+250 788 123 456" /></div>
          </div>
          <div className="space-y-1"><Label>Address</Label><Input defaultValue="Kigali, Rwanda" /></div>
          <Button className="gradient-primary text-primary-foreground">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Live Display Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Custom Display URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">csm.cwanda.site/live/</span>
              <Input defaultValue="demo-school" className="max-w-[200px]" />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground">Update URL</Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1"><Label>API Page URL</Label><Input defaultValue="https://api.csm.cwanda.site/v1" /></div>
          <Separator />
          <p className="text-sm text-muted-foreground">Manage your API keys and security settings from the organization panel.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigSettings;
