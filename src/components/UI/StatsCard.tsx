
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
  gradient = "from-blue-500 to-purple-600",
  description
}: StatsCardProps) => {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400", 
    neutral: "text-slate-400"
  };

  return (
    <Card className="stats-card group hover:scale-105 transition-all duration-300 animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-sm font-medium flex items-center space-x-1",
                changeColors[changeType]
              )}>
                <span>{change}</span>
              </p>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
            gradient
          )}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Progress bar for visual enhancement */}
        <div className="mt-4 w-full bg-slate-700/30 rounded-full h-1">
          <div 
            className={cn("h-1 rounded-full bg-gradient-to-r transition-all duration-1000", gradient)}
            style={{ width: `${Math.min(100, Math.abs(Number(value)) || 0)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
