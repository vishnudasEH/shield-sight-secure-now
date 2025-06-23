
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Users } from "lucide-react";

interface Vulnerability {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  assignedTo?: string;
}

interface BitsightOverviewCardsProps {
  vulnerabilities: Vulnerability[];
  loading: boolean;
}

export const BitsightOverviewCards = ({ vulnerabilities, loading }: BitsightOverviewCardsProps) => {
  const total = vulnerabilities.length;
  const critical = vulnerabilities.filter(v => v.severity === 'Critical').length;
  const high = vulnerabilities.filter(v => v.severity === 'High').length;
  const medium = vulnerabilities.filter(v => v.severity === 'Medium').length;
  const low = vulnerabilities.filter(v => v.severity === 'Low').length;
  const unassigned = vulnerabilities.filter(v => !v.assignedTo).length;
  const inProgress = vulnerabilities.filter(v => v.status === 'In Progress').length;

  const cards = [
    {
      title: "Total Vulnerabilities",
      value: total,
      icon: Shield,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      trend: "+5% from last week"
    },
    {
      title: "Critical",
      value: critical,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      trend: "-2 from yesterday"
    },
    {
      title: "High",
      value: high,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      trend: "+1 from yesterday"
    },
    {
      title: "Medium",
      value: medium,
      icon: TrendingDown,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      trend: "No change"
    },
    {
      title: "Low",
      value: low,
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      trend: "+3 new findings"
    },
    {
      title: "Unassigned",
      value: unassigned,
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      trend: "Needs attention"
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      trend: "Active remediation"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="neo-premium animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card, index) => (
        <Card key={card.title} className="neo-premium card-hover animate-fade-in-up-premium" style={{animationDelay: `${index * 0.1}s`}}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${card.color} mb-1`}>
              {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
