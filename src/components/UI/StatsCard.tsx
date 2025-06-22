
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
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconColor = "text-blue-600",
  gradient = "from-blue-500 to-purple-600"
}: StatsCardProps) => {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-gray-600"
              )}>
                {change}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r",
            gradient
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
