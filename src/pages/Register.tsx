import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, RegisterData } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, User, Building2, CreditCard, CheckCircle } from "lucide-react";
import AuthBrandPanel from "@/components/AuthBrandPanel";

const steps = [
  { label: "Admin Info", icon: User },
  { label: "Organization", icon: Building2 },
  { label: "Plan", icon: CreditCard },
];

const Register = () => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [authMethod, setAuthMethod] = useState<"email" | "google" | null>(null);
  const [form, setForm] = useState<RegisterData>({
    firstName: "", lastName: "", email: "", username: "", password: "",
    orgName: "", orgType: "school", orgAddress: "", orgEmail: "", orgPhone: "",
    plan: "free_trial",
  });

  const set = (key: keyof RegisterData, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    await register(form);
    navigate("/verify-email");
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      // After Google auth, go to org step
      setAuthMethod("google");
      setStep(1);
    } catch {
      // handle error
    }
  };

  const canNext = () => {
    if (step === 0) return form.firstName && form.lastName && form.email && form.username && form.password;
    if (step === 1) return form.orgName && form.orgType;
    return true;
  };

  // Initial choice screen (before steps)
  if (authMethod === null && step === 0) {
    return (
      <div className="min-h-screen flex bg-background">
        <AuthBrandPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden text-center">
              <div className="mx-auto w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <span className="text-primary-foreground font-heading font-bold text-xl">C</span>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
              <p className="text-muted-foreground text-sm mt-1 font-body">Start your free trial today</p>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 font-body border-border hover:bg-muted"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-body">or continue with email</span>
              </div>
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground font-semibold h-11 font-body"
              onClick={() => setAuthMethod("email")}
            >
              <User className="mr-2 h-4 w-4" />
              Continue with Email
            </Button>

            <p className="text-center text-sm text-muted-foreground font-body">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AuthBrandPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center">
            <div className="mx-auto w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <span className="text-primary-foreground font-heading font-bold text-xl">C</span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, i) => {
              const startIdx = authMethod === "google" ? 1 : 0;
              if (i < startIdx) return null;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:inline font-body ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
                </div>
              );
            })}
          </div>

          <div className="space-y-4 animate-fade-in">
            {step === 0 && authMethod === "email" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="font-body">First Name</Label>
                    <Input className="font-body h-10" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body">Last Name</Label>
                    <Input className="font-body h-10" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="font-body">Email</Label>
                  <Input className="font-body h-10" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="font-body">Username</Label>
                  <Input className="font-body h-10" value={form.username} onChange={(e) => set("username", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="font-body">Password</Label>
                  <Input className="font-body h-10" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="space-y-1">
                  <Label className="font-body">Organization Name</Label>
                  <Input className="font-body h-10" value={form.orgName} onChange={(e) => set("orgName", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="font-body">Organization Type</Label>
                  <Select value={form.orgType} onValueChange={(v) => set("orgType", v)}>
                    <SelectTrigger className="font-body h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School / Education Institute</SelectItem>
                      <SelectItem value="company">Company / Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="font-body">Address</Label>
                  <Input className="font-body h-10" value={form.orgAddress} onChange={(e) => set("orgAddress", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="font-body">Contact Email</Label>
                    <Input className="font-body h-10" type="email" value={form.orgEmail} onChange={(e) => set("orgEmail", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-body">Contact Phone</Label>
                    <Input className="font-body h-10" value={form.orgPhone} onChange={(e) => set("orgPhone", e.target.value)} />
                  </div>
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
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => set("plan", p.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all font-body ${
                      form.plan === p.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
                    }`}
                  >
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

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="font-body"
              onClick={() => {
                if (step === 0 || (authMethod === "google" && step === 1)) {
                  setAuthMethod(null);
                  setStep(0);
                } else {
                  setStep((s) => s - 1);
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 2 ? (
              <Button
                className="gradient-primary text-primary-foreground font-body"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && authMethod === "email" && !canNext()}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="gradient-primary text-primary-foreground font-body"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground font-body">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
