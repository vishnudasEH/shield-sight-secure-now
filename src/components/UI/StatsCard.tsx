
import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  description?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconColor = "text-primary",
  gradient,
  description
}: StatsCardProps) => {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="stats-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-sm font-medium",
                changeColors[changeType]
              )}>
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground font-medium">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            gradient ? "" : "bg-accent"
          )} style={gradient ? { background: gradient } : {}}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        {/* Simple Progress Indicator */}
        <div className="mt-4 w-full bg-accent rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${Math.min(100, Math.abs(Number(value)) || 50)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
