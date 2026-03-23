import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, RegisterData } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, User, Building2, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  { label: "Admin Info", icon: User },
  { label: "Organization", icon: Building2 },
  { label: "Plan", icon: CreditCard },
];

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegisterData>({
    firstName: "", lastName: "", email: "", username: "", password: "",
    orgName: "", orgType: "school", orgAddress: "", orgEmail: "", orgPhone: "",
    plan: "free_trial",
  });

  const set = (key: keyof RegisterData, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    await register(form);
    navigate("/verify-email");
  };

  const canNext = () => {
    if (step === 0) return form.firstName && form.lastName && form.email && form.username && form.password;
    if (step === 1) return form.orgName && form.orgType;
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-20" />
      <Card className="w-full max-w-lg relative z-10 shadow-2xl border-0 bg-card">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-primary-foreground font-heading font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-fade-in">
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>First Name</Label>
                    <Input value={form.firstName} onChange={e => set("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Last Name</Label>
                    <Input value={form.lastName} onChange={e => set("lastName", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} required /></div>
                <div className="space-y-1"><Label>Username</Label><Input value={form.username} onChange={e => set("username", e.target.value)} required /></div>
                <div className="space-y-1"><Label>Password</Label><Input type="password" value={form.password} onChange={e => set("password", e.target.value)} required /></div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="space-y-1"><Label>Organization Name</Label><Input value={form.orgName} onChange={e => set("orgName", e.target.value)} required /></div>
                <div className="space-y-1">
                  <Label>Organization Type</Label>
                  <Select value={form.orgType} onValueChange={v => set("orgType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School / Education Institute</SelectItem>
                      <SelectItem value="company">Company / Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label>Address</Label><Input value={form.orgAddress} onChange={e => set("orgAddress", e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Contact Email</Label><Input type="email" value={form.orgEmail} onChange={e => set("orgEmail", e.target.value)} /></div>
                  <div className="space-y-1"><Label>Contact Phone</Label><Input value={form.orgPhone} onChange={e => set("orgPhone", e.target.value)} /></div>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="space-y-3">
                {[
                  { id: "free_trial", name: "Free Trial", desc: "1 month free. 50 users, 2 devices.", price: "Free" },
                  { id: "basic", name: "Basic Plan", desc: "200 users, 5 devices, basic analytics.", price: "$19/mo" },
                  { id: "pro", name: "Pro Plan", desc: "Unlimited users, 20 devices, advanced analytics.", price: "$49/mo" },
                  { id: "enterprise", name: "Enterprise", desc: "Unlimited everything, priority support.", price: "Contact us" },
                ].map(p => (
                  <div key={p.id} onClick={() => set("plan", p.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.plan === p.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
                    }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-heading font-bold text-foreground">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                      </div>
                      <span className="font-heading font-bold text-primary text-lg">{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 2 ? (
              <Button className="gradient-primary text-primary-foreground" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            )}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
