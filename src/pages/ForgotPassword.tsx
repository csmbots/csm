import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-20" />
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            {sent ? <CheckCircle className="h-8 w-8 text-primary-foreground" /> : <Mail className="h-8 w-8 text-primary-foreground" />}
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {sent ? "Check Your Email" : "Reset Password"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {sent ? `We sent a reset link to ${email}` : "Enter your email to receive a password reset link"}
          </p>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <Button className="w-full gradient-primary text-primary-foreground font-semibold h-11" onClick={() => setSent(false)}>
              Send Again
            </Button>
          )}
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
