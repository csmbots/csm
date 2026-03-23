import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Mail, Lock, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { admin } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><UserCircle className="h-6 w-6 text-primary" /> Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Update your personal information and security settings.</p>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
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
            <div className="space-y-1"><Label>First Name</Label><Input defaultValue={admin?.firstName} /></div>
            <div className="space-y-1"><Label>Last Name</Label><Input defaultValue={admin?.lastName} /></div>
            <div className="space-y-1"><Label>Username</Label><Input defaultValue={admin?.username} /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" defaultValue={admin?.email} /></div>
          </div>
          <Button className="gradient-primary text-primary-foreground">Save Profile</Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader><CardTitle className="font-heading flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1"><Label>Current Password</Label><Input type="password" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>New Password</Label><Input type="password" /></div>
            <div className="space-y-1"><Label>Confirm Password</Label><Input type="password" /></div>
          </div>
          <Button className="gradient-primary text-primary-foreground">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
