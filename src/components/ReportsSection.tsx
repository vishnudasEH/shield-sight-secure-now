
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, TrendingUp, Share, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface VulnerabilityMetrics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export const ReportsSection = () => {
  const [metrics, setMetrics] = useState<VulnerabilityMetrics>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const { data: vulnerabilities, error } = await supabase
        .from('nessus_vulnerabilities')
        .select('severity');

      if (error) throw error;

      const severityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
      };

      vulnerabilities?.forEach(vuln => {
        if (severityCounts.hasOwnProperty(vuln.severity)) {
          severityCounts[vuln.severity as keyof typeof severityCounts]++;
        }
      });

      setMetrics({
        total: vulnerabilities?.length || 0,
        critical: severityCounts.Critical,
        high: severityCounts.High,
        medium: severityCounts.Medium,
        low: severityCounts.Low
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportData = [
    { month: "Current Scan", vulnerabilities: metrics.total, resolved: 0, critical: metrics.critical },
  ];

  const trendData = [
    { month: "Jan", critical: 15, high: 42, medium: 89, low: 134 },
    { month: "Feb", critical: 13, high: 38, medium: 92, low: 145 },
    { month: "Mar", critical: 18, high: 45, medium: 85, low: 167 },
    { month: "Current", critical: metrics.critical, high: metrics.high, medium: metrics.medium, low: metrics.low },
  ];

  const reports = [
    {
      id: 1,
      name: `Security Assessment Report - ${new Date().toLocaleDateString()}`,
      type: "Executive Summary",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "2.4 MB",
      vulnerabilities: metrics.total,
    },
    {
      id: 2,
      name: "Critical Vulnerabilities Report",
      type: "Technical Report",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "1.2 MB",
      vulnerabilities: metrics.critical,
    },
    {
      id: 3,
      name: "Asset Vulnerability Matrix",
      type: "Compliance Report",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "1.8 MB",
      vulnerabilities: metrics.high + metrics.medium,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Reports</h2>
          <p className="text-slate-400">Generate comprehensive reports based on current vulnerability data</p>
        </div>
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          {metrics.total} total vulnerabilities
        </Badge>
      </div>

      {/* Current Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">{metrics.total}</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-400">{metrics.critical}</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">High</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-orange-400">{metrics.high}</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Medium + Low</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-yellow-400">{metrics.medium + metrics.low}</span>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate New Report
              </CardTitle>
              <CardDescription className="text-slate-400">
                Create comprehensive security reports based on current scan data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: "Executive Summary", description: "High-level overview with current metrics", icon: TrendingUp },
                  { type: "Technical Report", description: "Detailed vulnerability findings", icon: FileText },
                  { type: "Compliance Report", description: "Regulatory compliance assessment", icon: Calendar },
                  { type: "Asset Risk Matrix", description: "Asset-based vulnerability mapping", icon: Share },
                ].map((reportType) => (
                  <div
                    key={reportType.type}
                    className="p-4 rounded-lg border border-slate-600 bg-slate-700/50 hover:border-slate-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <reportType.icon className="h-5 w-5 text-blue-400" />
                      <h3 className="text-slate-300 font-medium">{reportType.type}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">{reportType.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scan Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Assets Scanned</span>
                  <span className="text-white font-semibold">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scan Coverage</span>
                  <span className="text-white font-semibold">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Critical/High Ratio</span>
                  <span className="text-white font-semibold">{Math.round((metrics.critical + metrics.high) / metrics.total * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Scan</span>
                  <span className="text-white font-semibold">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vulnerability Trends Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Vulnerability Trends</CardTitle>
          <CardDescription className="text-slate-400">
            Historical vulnerability data with current scan results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={3} name="Critical" />
              <Line type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={2} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#d97706" strokeWidth={2} name="Medium" />
              <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Reports</CardTitle>
          <CardDescription className="text-slate-400">
            Generated reports based on current vulnerability data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex-1">
                  <h3 className="text-slate-300 font-medium mb-1">{report.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.generated}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span>{report.vulnerabilities} vulnerabilities</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="default"
                    className="bg-green-500/20 text-green-400"
                  >
                    {report.status}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="border-slate-600">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
