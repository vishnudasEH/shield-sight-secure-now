
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip, Legend } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface Vulnerability {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  firstDetected: string;
  assignedTo?: string;
}

interface BitsightChartsProps {
  vulnerabilities: Vulnerability[];
}

export const BitsightCharts = ({ vulnerabilities }: BitsightChartsProps) => {
  // Severity distribution data
  const severityData = [
    { name: 'Critical', value: vulnerabilities.filter(v => v.severity === 'Critical').length, color: '#ef4444' },
    { name: 'High', value: vulnerabilities.filter(v => v.severity === 'High').length, color: '#f97316' },
    { name: 'Medium', value: vulnerabilities.filter(v => v.severity === 'Medium').length, color: '#eab308' },
    { name: 'Low', value: vulnerabilities.filter(v => v.severity === 'Low').length, color: '#22c55e' }
  ];

  // Time series data (mock - last 30 days)
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      vulnerabilities: Math.floor(Math.random() * 20) + 10,
      resolved: Math.floor(Math.random() * 5) + 2
    };
  });

  // User activity data (mock)
  const userActivityData = [
    { name: 'Alice Johnson', resolved: 15, assigned: 8 },
    { name: 'Bob Smith', resolved: 12, assigned: 5 },
    { name: 'Carol Davis', resolved: 18, assigned: 12 },
    { name: 'David Wilson', resolved: 9, assigned: 3 },
    { name: 'Eve Brown', resolved: 21, assigned: 15 }
  ];

  // Trend data for open vs resolved
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      open: Math.floor(Math.random() * 50) + 20,
      resolved: Math.floor(Math.random() * 30) + 10,
      newFindings: Math.floor(Math.random() * 15) + 5
    };
  });

  const chartConfig = {
    vulnerabilities: {
      label: "Vulnerabilities",
      color: "#3b82f6",
    },
    resolved: {
      label: "Resolved",
      color: "#22c55e",
    },
    open: {
      label: "Open",
      color: "#ef4444",
    },
    newFindings: {
      label: "New Findings",
      color: "#f97316",
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Severity Distribution Pie Chart */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-400" />
            Vulnerabilities by Severity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Time Series Bar Chart */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-400" />
            Vulnerabilities Over Time (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeriesData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="vulnerabilities" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Activity Chart */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData} layout="horizontal">
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  width={100}
                />
                <Bar dataKey="resolved" fill="#22c55e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="assigned" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Trend Line Chart */}
      <Card className="neo-premium">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Open vs Resolved Trends (12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="open" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="newFindings" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
