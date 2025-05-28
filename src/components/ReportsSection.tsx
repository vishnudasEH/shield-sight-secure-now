import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, TrendingUp, Share, Eye, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { reportService, reportTemplates, ReportData } from "@/services/reportService";

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
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [customReportName, setCustomReportName] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const data = await reportService.fetchReportData();
      setReportData(data);
      
      setMetrics({
        total: data.totalVulnerabilities,
        critical: data.severityCounts.Critical,
        high: data.severityCounts.High,
        medium: data.severityCounts.Medium,
        low: data.severityCounts.Low
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedReportType || !reportData) return;
    
    setGeneratingReport(true);
    try {
      const template = reportTemplates.find(t => t.type === selectedReportType);
      const reportName = customReportName || template?.name || 'Security Report';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;
      
      const csvContent = reportService.generateCSVReport(reportData, selectedReportType, reportName);
      reportService.downloadCSV(csvContent, filename);
      
      setIsGenerateDialogOpen(false);
      setSelectedReportType("");
      setCustomReportName("");
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleViewReport = (reportType: string) => {
    if (!reportData) return;
    
    const template = reportTemplates.find(t => t.type === reportType);
    const reportName = template?.name || 'Security Report';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}_preview`;
    
    const csvContent = reportService.generateCSVReport(reportData, reportType, reportName);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadReport = (reportType: string) => {
    if (!reportData) return;
    
    const template = reportTemplates.find(t => t.type === reportType);
    const reportName = template?.name || 'Security Report';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;
    
    const csvContent = reportService.generateCSVReport(reportData, reportType, reportName);
    reportService.downloadCSV(csvContent, filename);
  };

  const chartData = [
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
      type: "executive",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "2.4 MB",
      vulnerabilities: metrics.total,
    },
    {
      id: 2,
      name: "Critical Vulnerabilities Report",
      type: "technical",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "1.2 MB",
      vulnerabilities: metrics.critical,
    },
    {
      id: 3,
      name: "Asset Vulnerability Matrix",
      type: "asset-matrix",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "1.8 MB",
      vulnerabilities: metrics.high + metrics.medium,
    },
    {
      id: 4,
      name: "Compliance Assessment Report",
      type: "compliance",
      generated: new Date().toISOString().split('T')[0],
      status: "Ready",
      size: "0.9 MB",
      vulnerabilities: metrics.total,
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
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-slate-600 bg-slate-700/50 hover:border-slate-500 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedReportType(template.type);
                      setCustomReportName(template.name);
                      setIsGenerateDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <h3 className="text-slate-300 font-medium">{template.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">{template.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Custom Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Generate Security Report</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Customize your report settings and generate a comprehensive security assessment
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Report Type</label>
                        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {reportTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.type}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Report Name</label>
                        <Input
                          value={customReportName}
                          onChange={(e) => setCustomReportName(e.target.value)}
                          placeholder="Enter custom report name"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      
                      {selectedReportType && (
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Report Preview</h4>
                          <p className="text-sm text-slate-400">
                            {reportTemplates.find(t => t.type === selectedReportType)?.description}
                          </p>
                          <div className="mt-2 text-xs text-slate-500">
                            Will include: {metrics.total} vulnerabilities, {reportData?.assets.length || 0} assets
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleGenerateReport}
                          disabled={!selectedReportType || generatingReport}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {generatingReport ? 'Generating...' : 'Generate & Download'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsGenerateDialogOpen(false)}
                          className="border-slate-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                  <span className="text-white font-semibold">{reportData?.assets.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scan Coverage</span>
                  <span className="text-white font-semibold">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Critical/High Ratio</span>
                  <span className="text-white font-semibold">
                    {metrics.total > 0 ? Math.round((metrics.critical + metrics.high) / metrics.total * 100) : 0}%
                  </span>
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

      {/* Available Reports */}
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
                    <span>{reportTemplates.find(t => t.type === report.type)?.name || report.type}</span>
                    <span>•</span>
                    <span>{report.generated}</span>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600"
                      onClick={() => handleViewReport(report.type)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600"
                      onClick={() => handleDownloadReport(report.type)}
                    >
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
