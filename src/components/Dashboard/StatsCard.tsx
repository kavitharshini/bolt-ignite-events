import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient: "primary" | "secondary" | "accent" | "success";
}

const StatsCard = ({ title, value, change, changeType, icon: Icon, gradient }: StatsCardProps) => {
  const getGradientClass = (gradient: string) => {
    switch (gradient) {
      case "primary":
        return "from-primary/10 to-primary-light/10 border-primary/20";
      case "secondary":
        return "from-secondary/10 to-secondary-light/10 border-secondary/20";
      case "accent":
        return "from-accent/10 to-accent-light/10 border-accent/20";
      case "success":
        return "from-success/10 to-success/5 border-success/20";
      default:
        return "from-primary/10 to-primary-light/10 border-primary/20";
    }
  };

  const getIconColor = (gradient: string) => {
    switch (gradient) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      case "accent":
        return "text-accent";
      case "success":
        return "text-success";
      default:
        return "text-primary";
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getGradientClass(gradient)} hover:shadow-lg transition-all duration-300 border`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground mb-1">
              {value}
            </p>
            <p className={`text-sm font-medium ${getChangeColor(changeType)}`}>
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradientClass(gradient)} border`}>
            <Icon className={`h-6 w-6 ${getIconColor(gradient)}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;