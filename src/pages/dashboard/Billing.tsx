import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Check, Zap, Crown, Building2 } from "lucide-react";

const plans = [
  {
    id: "free_trial",
    name: "Free Trial",
    description: "Get started",
    price: "$0",
    period: "/30 days",
    icon: Zap,
    features: ["5 Devices", "100 Users", "Basic Analytics", "Email Support"],
    current: true,
  },
  {
    id: "basic",
    name: "Basic",
    description: "For small organizations",
    price: "$29",
    period: "/month",
    icon: CreditCard,
    features: ["10 Devices", "500 Users", "Advanced Analytics", "Priority Support", "Custom Reports"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing organizations",
    price: "$79",
    period: "/month",
    icon: Crown,
    features: ["50 Devices", "5,000 Users", "Premium Analytics", "24/7 Support", "API Access", "Custom Branding"],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large institutions",
    price: "$199",
    period: "/month",
    icon: Building2,
    features: ["Unlimited Devices", "Unlimited Users", "Full Analytics Suite", "Dedicated Support", "On-premise Option", "SLA"],
  },
];

const Billing = () => {
  const trialDaysLeft = 23;
  const trialTotal = 30;
  const trialProgress = ((trialTotal - trialDaysLeft) / trialTotal) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your subscription and payment.</p>
      </div>

      {/* Big blue banner */}
      <div className="rounded-xl bg-gradient-to-r from-[hsl(212,100%,50%)] to-[hsl(224,80%,60%)] p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-heading font-bold text-lg">Current Plan: Free Trial</p>
            <p className="text-sm text-white/80">{trialDaysLeft} days remaining • Started Jun 1, 2026</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Trial</Badge>
        </div>
        <Progress value={trialProgress} className="h-2 bg-white/20 [&>div]:bg-white" />
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <Card
              key={p.id}
              className={`border shadow-sm bg-card transition-all hover:shadow-lg relative ${
                p.recommended ? "border-primary ring-1 ring-primary" : p.current ? "border-success" : "border-border"
              }`}
            >
              {p.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0 text-xs px-3">
                  POPULAR
                </Badge>
              )}
              <CardHeader className="pb-3 pt-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-foreground text-lg">{p.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2">
                  <span className="text-3xl font-heading font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </div>
                ))}
                <Button
                  className={`w-full mt-4 ${
                    p.current
                      ? "bg-muted text-muted-foreground hover:bg-muted"
                      : "gradient-primary text-primary-foreground hover:opacity-90"
                  }`}
                  disabled={p.current}
                >
                  {p.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Billing;
