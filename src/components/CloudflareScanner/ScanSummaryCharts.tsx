
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

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

interface ScanSummaryChartsProps {
  summary: ScanSummary;
}

export const ScanSummaryCharts = ({ summary }: ScanSummaryChartsProps) => {
  const severityData = [
    { name: "Critical", value: summary.vulnerabilities.critical, color: "#dc2626" },
    { name: "High", value: summary.vulnerabilities.high, color: "#ea580c" },
    { name: "Medium", value: summary.vulnerabilities.medium, color: "#d97706" },
    { name: "Low", value: summary.vulnerabilities.low, color: "#2563eb" },
    { name: "Info", value: summary.vulnerabilities.info, color: "#6b7280" },
  ].filter(item => item.value > 0);

  const dnsChangeData = [
    { name: "New Entries", value: summary.new_entries, color: "#10b981" },
    { name: "Removed Entries", value: summary.removed_entries, color: "#ef4444" },
  ];

  const vulnerabilityBarData = [
    { severity: "Critical", count: summary.vulnerabilities.critical, color: "#dc2626" },
    { severity: "High", count: summary.vulnerabilities.high, color: "#ea580c" },
    { severity: "Medium", count: summary.vulnerabilities.medium, color: "#d97706" },
    { severity: "Low", count: summary.vulnerabilities.low, color: "#2563eb" },
    { severity: "Info", count: summary.vulnerabilities.info, color: "#6b7280" },
  ];

  // Mock timeline data for demonstration
  const timelineData = [
    { date: "Day 1", vulnerabilities: 20, dns_changes: 5 },
    { date: "Day 2", vulnerabilities: 18, dns_changes: 8 },
    { date: "Day 3", vulnerabilities: 25, dns_changes: 12 },
    { date: "Day 4", vulnerabilities: 22, dns_changes: 3 },
    { date: "Today", vulnerabilities: summary.vulnerabilities.total, dns_changes: summary.new_entries },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Severity Distribution Pie Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Vulnerability Severity Distribution</CardTitle>
          <CardDescription className="text-slate-400">
            Breakdown of vulnerabilities by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f3f4f6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* DNS Changes Bar Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">DNS Record Changes</CardTitle>
          <CardDescription className="text-slate-400">
            New and removed DNS entries from latest scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dnsChangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f3f4f6'
                }}
              />
              <Bar dataKey="value" fill="#8884d8">
                {dnsChangeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vulnerability Severity Bar Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Vulnerabilities by Severity</CardTitle>
          <CardDescription className="text-slate-400">
            Count of vulnerabilities across different severity levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnerabilityBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="severity" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f3f4f6'
                }}
              />
              <Bar dataKey="count" fill="#8884d8">
                {vulnerabilityBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Timeline Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Activity Timeline</CardTitle>
          <CardDescription className="text-slate-400">
            Vulnerability and DNS change trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f3f4f6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vulnerabilities" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Vulnerabilities"
              />
              <Line 
                type="monotone" 
                dataKey="dns_changes" 
                stroke="#10b981" 
                strokeWidth={2}
                name="DNS Changes"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
