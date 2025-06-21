
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface ScanSummary {
  scan_name: string;
  date: string;
  new_entries: number;
  removed_entries: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

interface EnhancedScanChartsProps {
  summary: ScanSummary;
  previousScan?: ScanSummary;
}

export const EnhancedScanCharts = ({ summary, previousScan }: EnhancedScanChartsProps) => {
  const severityData = [
    { name: "Critical", value: summary.vulnerabilities.critical, color: "#dc2626", emoji: "🔴" },
    { name: "High", value: summary.vulnerabilities.high, color: "#ea580c", emoji: "🟠" },
    { name: "Medium", value: summary.vulnerabilities.medium, color: "#d97706", emoji: "🟡" },
    { name: "Low", value: summary.vulnerabilities.low, color: "#2563eb", emoji: "🔵" },
    { name: "Info", value: summary.vulnerabilities.info, color: "#6b7280", emoji: "⚪" },
  ].filter(item => item.value > 0);

  const trendData = [
    { 
      name: "Previous", 
      vulnerabilities: previousScan?.vulnerabilities.total || 0,
      dns_changes: (previousScan?.new_entries || 0) + (previousScan?.removed_entries || 0)
    },
    { 
      name: "Current", 
      vulnerabilities: summary.vulnerabilities.total,
      dns_changes: summary.new_entries + summary.removed_entries
    }
  ];

  const comparisonData = [
    { category: "Critical", current: summary.vulnerabilities.critical, previous: previousScan?.vulnerabilities.critical || 0 },
    { category: "High", current: summary.vulnerabilities.high, previous: previousScan?.vulnerabilities.high || 0 },
    { category: "Medium", current: summary.vulnerabilities.medium, previous: previousScan?.vulnerabilities.medium || 0 },
    { category: "Low", current: summary.vulnerabilities.low, previous: previousScan?.vulnerabilities.low || 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, emoji }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${emoji} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Enhanced Severity Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🎯 Vulnerability Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              Risk severity breakdown with visual indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomPieLabel}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-sm">
                  <span>{item.emoji}</span>
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-medium">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📊 Scan Comparison
              {summary.vulnerabilities.total > (previousScan?.vulnerabilities.total || 0) ? (
                <TrendingUp className="h-4 w-4 text-red-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-400" />
              )}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Current vs previous scan results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="current" 
                  fill="#3b82f6" 
                  name="Current Scan"
                  animationDuration={1000}
                />
                <Bar 
                  dataKey="previous" 
                  fill="#64748b" 
                  name="Previous Scan"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Trend Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📈 Trend Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              Security posture evolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="vulnerabilities" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Vulnerabilities"
                  animationDuration={1200}
                />
                <Area 
                  type="monotone" 
                  dataKey="dns_changes" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="DNS Changes"
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
