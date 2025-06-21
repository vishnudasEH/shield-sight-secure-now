
import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Server, TrendingUp, Calendar, FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/UI/StatsCard";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface VulnerabilityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export const DashboardOverview = () => {
  const [vulnStats, setVulnStats] = useState<VulnerabilityStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  });

  useEffect(() => {
    fetchVulnerabilityStats();
  }, []);

  const fetchVulnerabilityStats = async () => {
    try {
      const { data: vulnerabilities, error } = await supabase
        .from('nessus_vulnerabilities')
        .select('severity');

      if (error) throw error;

      const stats = {
        total: vulnerabilities?.length || 0,
        critical: vulnerabilities?.filter(v => v.severity === 'Critical').length || 0,
        high: vulnerabilities?.filter(v => v.severity === 'High').length || 0,
        medium: vulnerabilities?.filter(v => v.severity === 'Medium').length || 0,
        low: vulnerabilities?.filter(v => v.severity === 'Low').length || 0,
        info: vulnerabilities?.filter(v => v.severity === 'Info').length || 0,
      };

      setVulnStats(stats);
    } catch (error) {
      console.error('Error fetching vulnerability stats:', error);
    }
  };

  const severityData = [
    { name: "Critical", value: vulnStats.critical, color: "#ef4444", fill: "#ef4444" },
    { name: "High", value: vulnStats.high, color: "#f97316", fill: "#f97316" },
    { name: "Medium", value: vulnStats.medium, color: "#eab308", fill: "#eab308" },
    { name: "Low", value: vulnStats.low, color: "#3b82f6", fill: "#3b82f6" },
    { name: "Info", value: vulnStats.info, color: "#6b7280", fill: "#6b7280" },
  ].filter(item => item.value > 0);

  const trendData = [
    { month: "Jan", vulnerabilities: 45, scans: 12 },
    { month: "Feb", vulnerabilities: 52, scans: 15 },
    { month: "Mar", vulnerabilities: 38, scans: 18 },
    { month: "Apr", vulnerabilities: 61, scans: 14 },
    { month: "May", vulnerabilities: 55, scans: 20 },
    { month: "Jun", vulnerabilities: vulnStats.total, scans: 16 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Monitor your security posture and vulnerability status</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Scan
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Vulnerabilities"
          value={vulnStats.total}
          change="+12% from last month"
          changeType="negative"
          icon={AlertTriangle}
          gradient="from-red-500 to-orange-500"
        />
        <StatsCard
          title="Critical Issues"
          value={vulnStats.critical}
          change="+3 this week"
          changeType="negative"
          icon={Shield}
          gradient="from-red-600 to-red-500"
        />
        <StatsCard
          title="Assets Monitored"
          value="247"
          change="+5 new assets"
          changeType="positive"
          icon={Server}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Risk Score"
          value="7.2"
          change="-0.3 improvement"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vulnerability Distribution */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Vulnerability Distribution</CardTitle>
            <CardDescription>Current security issues by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
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
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Security Trends</CardTitle>
            <CardDescription>Monthly vulnerability and scan activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="vulnerabilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#vulnerabilityGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scanGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Activity</CardTitle>
          <CardDescription>Latest security events and scan results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "critical", message: "Critical vulnerability detected in Web Server", time: "2 minutes ago", color: "red" },
              { type: "scan", message: "Nessus scan completed for Production Network", time: "15 minutes ago", color: "blue" },
              { type: "resolved", message: "High severity issue patched on Database Server", time: "1 hour ago", color: "green" },
              { type: "scan", message: "Nuclei scan started for new assets", time: "2 hours ago", color: "purple" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                <div className={`w-3 h-3 rounded-full bg-${activity.color}-500`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
