
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
  iconColor = "text-blue-400",
  gradient = "from-blue-500 to-indigo-500",
  description
}: StatsCardProps) => {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400", 
    neutral: "text-slate-400"
  };

  return (
    <Card className="stats-card animate-fade-scale group">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-white">
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
              <p className="text-xs text-slate-500 font-medium">
                {description}
              </p>
            )}
          </div>
          
          <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        {/* Simple Progress Indicator */}
        <div className="mt-4 w-full bg-slate-700/30 rounded-full h-1">
          <div 
            className="h-1 rounded-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${Math.min(100, Math.abs(Number(value)) || 50)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
