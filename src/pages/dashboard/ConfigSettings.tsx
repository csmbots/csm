import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building2, Globe, Shield, Lock, UserCircle, Camera, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const ConfigSettings = () => {
  const { admin } = useAuth();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and organization</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" /> Profile
              </CardTitle>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {admin?.firstName[0]}{admin?.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{admin?.firstName} {admin?.lastName}</p>
                  <p className="text-sm text-muted-foreground">@{admin?.username}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>First Name</Label><Input defaultValue={admin?.firstName} /></div>
                <div className="space-y-1.5"><Label>Last Name</Label><Input defaultValue={admin?.lastName} /></div>
                <div className="space-y-1.5"><Label>Username</Label><Input defaultValue={admin?.username} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue={admin?.email} /></div>
              </div>
              <Button className="gradient-primary text-primary-foreground">Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Organization Info
              </CardTitle>
              <p className="text-sm text-muted-foreground">Manage your organization details</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Organization Name</Label><Input defaultValue={admin?.organizationName} /></div>
                <div className="space-y-1.5"><Label>Organization Type</Label><Input defaultValue={admin?.organizationType} disabled /></div>
                <div className="space-y-1.5"><Label>Contact Email</Label><Input type="email" defaultValue="contact@school.rw" /></div>
                <div className="space-y-1.5"><Label>Contact Phone</Label><Input defaultValue="+250 788 123 456" /></div>
              </div>
              <div className="space-y-1.5"><Label>Address</Label><Input defaultValue="Kigali, Rwanda" /></div>
              <Separator />
              <div className="space-y-1.5">
                <Label>Custom Display URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">csm.cwanda.site/live/</span>
                  <Input defaultValue="demo-school" className="max-w-[200px]" />
                </div>
              </div>
              <Button className="gradient-primary text-primary-foreground">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Security
              </CardTitle>
              <p className="text-sm text-muted-foreground">Manage your password and security settings</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Current password</Label>
                <div className="relative">
                  <Input type={showCurrentPass ? "text" : "password"} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <div className="relative">
                  <Input type={showNewPass ? "text" : "password"} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Confirm new password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Update password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Privacy
              </CardTitle>
              <p className="text-sm text-muted-foreground">Control your data and visibility preferences</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Show online status</p>
                  <p className="text-xs text-muted-foreground">Let other admins see when you're online</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Email notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email alerts for important events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">API access logging</p>
                  <p className="text-xs text-muted-foreground">Log all API requests for auditing</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label>API Endpoint URL</Label>
                <Input defaultValue="https://api.csm.cwanda.site/v1" disabled />
                <p className="text-xs text-muted-foreground">Manage API keys from the organization panel.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigSettings;
