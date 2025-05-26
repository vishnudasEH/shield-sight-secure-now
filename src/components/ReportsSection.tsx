
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, TrendingUp, Share, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const reportData = [
  { month: "Jan", vulnerabilities: 45, resolved: 38, critical: 12 },
  { month: "Feb", vulnerabilities: 52, resolved: 44, critical: 8 },
  { month: "Mar", vulnerabilities: 38, resolved: 35, critical: 15 },
  { month: "Apr", vulnerabilities: 61, resolved: 52, critical: 6 },
  { month: "May", vulnerabilities: 42, resolved: 39, critical: 9 },
  { month: "Jun", vulnerabilities: 35, resolved: 32, critical: 4 },
];

const reports = [
  {
    id: 1,
    name: "Monthly Security Report - January 2024",
    type: "Monthly Summary",
    generated: "2024-01-31",
    status: "Ready",
    size: "2.4 MB",
    vulnerabilities: 45,
  },
  {
    id: 2,
    name: "Critical Vulnerabilities Executive Summary",
    type: "Executive Brief",
    generated: "2024-01-28",
    status: "Ready",
    size: "856 KB",
    vulnerabilities: 12,
  },
  {
    id: 3,
    name: "PCI DSS Compliance Report Q1 2024",
    type: "Compliance",
    generated: "2024-01-25",
    status: "Ready",
    size: "1.8 MB",
    vulnerabilities: 23,
  },
  {
    id: 4,
    name: "Network Infrastructure Assessment",
    type: "Technical Report",
    generated: "2024-01-20",
    status: "Generating",
    size: "Pending",
    vulnerabilities: 67,
  },
];

export const ReportsSection = () => {
  return (
    <div className="space-y-6">
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
                Create comprehensive security reports for stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: "Executive Summary", description: "High-level overview for management", icon: TrendingUp },
                  { type: "Technical Report", description: "Detailed technical findings", icon: FileText },
                  { type: "Compliance Report", description: "Regulatory compliance status", icon: Calendar },
                  { type: "Custom Report", description: "Tailored report configuration", icon: Share },
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
              <CardTitle className="text-white">Report Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reports Generated</span>
                  <span className="text-white font-semibold">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">This Month</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg. Generation Time</span>
                  <span className="text-white font-semibold">3.2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Downloads</span>
                  <span className="text-white font-semibold">1,832</span>
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
            Monthly vulnerability discovery and resolution metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
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
              <Bar dataKey="vulnerabilities" fill="#ef4444" name="Total Vulnerabilities" />
              <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
              <Bar dataKey="critical" fill="#f97316" name="Critical" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reports</CardTitle>
          <CardDescription className="text-slate-400">
            Access and manage generated security reports
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
                    variant={report.status === "Ready" ? "default" : "secondary"}
                    className={report.status === "Generating" ? "bg-blue-500/20 text-blue-400" : ""}
                  >
                    {report.status}
                  </Badge>
                  
                  {report.status === "Ready" && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
