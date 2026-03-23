import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { MailCheck } from "lucide-react";

const VerifyEmail = () => {
  const { verifyEmail, admin } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const ok = await verifyEmail(code);
    if (ok) navigate("/dashboard");
    else setError("Invalid verification code. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-20" />
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <MailCheck className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm mt-2">
            We sent a 6-digit code to <strong className="text-foreground">{admin?.email || "your email"}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground font-semibold h-11"
            onClick={handleVerify} disabled={code.length < 6 || loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button className="text-primary font-medium hover:underline">Resend Code</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
