
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
  iconColor = "text-indigo-400",
  gradient = "from-indigo-500 to-purple-600",
  description
}: StatsCardProps) => {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400", 
    neutral: "text-slate-400"
  };

  return (
    <Card className="stats-card animate-fade-scale">
      <CardContent className="p-8 relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <Icon className="w-full h-full" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-4xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-sm font-semibold flex items-center space-x-2",
                changeColors[changeType]
              )}>
                <span>{change}</span>
              </p>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 relative overflow-hidden",
            gradient
          )}>
            <Icon className="h-8 w-8 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6 w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
          <div 
            className={cn("h-2 rounded-full bg-gradient-to-r transition-all duration-1000 relative overflow-hidden", gradient)}
            style={{ width: `${Math.min(100, Math.abs(Number(value)) || 50)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Subtle Glow Effect */}
        <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br", gradient)}></div>
      </CardContent>
    </Card>
  );
};
