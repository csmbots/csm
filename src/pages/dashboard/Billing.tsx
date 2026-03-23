import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Star } from "lucide-react";

const plans = [
  { id: "free_trial", name: "Free Trial", price: "Free", period: "30 days", features: ["50 Users", "2 Devices", "Basic Analytics", "Email Support"], current: true },
  { id: "basic", name: "Basic", price: "$19", period: "/month", features: ["200 Users", "5 Devices", "Basic Analytics", "Email Support", "CSV Reports"] },
  { id: "pro", name: "Pro", price: "$49", period: "/month", features: ["Unlimited Users", "20 Devices", "Advanced Analytics", "Priority Support", "API Access", "Custom Reports"], recommended: true },
  { id: "enterprise", name: "Enterprise", price: "Custom", period: "", features: ["Unlimited Everything", "24/7 Support", "Custom Integration", "SLA Guarantee", "Dedicated Manager"] },
];

const Billing = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" /> Billing & Plans</h1>
      <p className="text-muted-foreground text-sm mt-1">Manage your subscription and billing information.</p>
    </div>

    <Card className="border-0 shadow-sm bg-card">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="font-heading font-bold text-foreground text-lg">Free Trial</p>
          <p className="text-xs text-warning">Expires in 25 days</p>
        </div>
        <Badge className="gradient-primary text-primary-foreground border-0">Active</Badge>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {plans.map(p => (
        <Card key={p.id} className={`border-2 shadow-sm bg-card transition-all hover:shadow-md ${p.recommended ? "border-primary shadow-md" : p.current ? "border-success" : "border-border"}`}>
          <CardHeader className="pb-2 relative">
            {p.recommended && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0"><Star className="h-3 w-3 mr-1" />Recommended</Badge>}
            <CardTitle className="font-heading text-foreground text-center">{p.name}</CardTitle>
            <div className="text-center">
              <span className="text-3xl font-heading font-bold text-foreground">{p.price}</span>
              <span className="text-muted-foreground text-sm">{p.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {p.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground"><Check className="h-4 w-4 text-success shrink-0" />{f}</div>
            ))}
            <Button className={`w-full mt-2 ${p.current ? "bg-success text-success-foreground" : p.recommended ? "gradient-primary text-primary-foreground" : ""}`} variant={p.current || p.recommended ? "default" : "outline"} disabled={p.current}>
              {p.current ? "Current Plan" : "Upgrade"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Billing;
