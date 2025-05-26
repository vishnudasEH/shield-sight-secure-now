
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar, 
  BarChart3,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const riskMetrics = [
  { name: "Critical", value: 12, color: "#dc2626", trend: -2 },
  { name: "High", value: 34, color: "#ea580c", trend: -5 },
  { name: "Medium", value: 87, color: "#d97706", trend: +3 },
  { name: "Low", value: 156, color: "#65a30d", trend: +12 },
];

const riskTrends = [
  { month: "Jan", critical: 15, high: 42, medium: 89, low: 134 },
  { month: "Feb", critical: 13, high: 38, medium: 92, low: 145 },
  { month: "Mar", critical: 18, high: 45, medium: 85, low: 167 },
  { month: "Apr", critical: 12, high: 34, medium: 87, low: 156 },
];

const riskAssessments = [
  {
    id: "RA-001",
    asset: "Web Server Cluster",
    riskScore: 8.5,
    status: "Active",
    lastAssessed: "2024-01-15",
    assessor: "John Doe",
    category: "Infrastructure"
  },
  {
    id: "RA-002",
    asset: "Database Servers",
    riskScore: 9.2,
    status: "Review",
    lastAssessed: "2024-01-14",
    assessor: "Jane Smith",
    category: "Data"
  },
  {
    id: "RA-003",
    asset: "Network Firewalls",
    riskScore: 6.8,
    status: "Completed",
    lastAssessed: "2024-01-13",
    assessor: "Mike Johnson",
    category: "Network"
  }
];

const mitigationPlans = [
  {
    id: "MP-001",
    title: "Critical Vulnerability Remediation",
    priority: "Critical",
    status: "In Progress",
    dueDate: "2024-02-01",
    assignedTo: "Security Team",
    progress: 65
  },
  {
    id: "MP-002",
    title: "Network Segmentation Implementation",
    priority: "High",
    status: "Planning",
    dueDate: "2024-02-15",
    assignedTo: "Network Team",
    progress: 25
  },
  {
    id: "MP-003",
    title: "Access Control Review",
    priority: "Medium",
    status: "Completed",
    dueDate: "2024-01-30",
    assignedTo: "IAM Team",
    progress: 100
  }
];

export const RiskManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getRiskColor = (score: number) => {
    if (score >= 9) return "text-red-400";
    if (score >= 7) return "text-orange-400";
    if (score >= 5) return "text-yellow-400";
    return "text-green-400";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-green-500/20 text-green-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Management</h2>
          <p className="text-slate-400">Comprehensive risk assessment and mitigation planning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Risk Assessments
          </TabsTrigger>
          <TabsTrigger value="mitigation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Mitigation Plans
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {riskMetrics.map((metric) => (
              <Card key={metric.name} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">{metric.name} Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{metric.value}</span>
                    <div className={`flex items-center text-sm ${metric.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {metric.trend > 0 ? '+' : ''}{metric.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskMetrics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                    <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={2} />
                    <Line type="monotone" dataKey="medium" stroke="#d97706" strokeWidth={2} />
                    <Line type="monotone" dataKey="low" stroke="#65a30d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6 space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search risk assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {riskAssessments.map((assessment) => (
              <Card key={assessment.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{assessment.asset}</h3>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {assessment.id}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Risk Score:</span>
                          <span className={`ml-2 font-semibold ${getRiskColor(assessment.riskScore)}`}>
                            {assessment.riskScore}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Category:</span>
                          <span className="ml-2 text-slate-300">{assessment.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Assessor:</span>
                          <span className="ml-2 text-slate-300">{assessment.assessor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Last Assessed:</span>
                          <span className="ml-2 text-slate-300">{assessment.lastAssessed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mitigation" className="mt-6 space-y-6">
          <div className="grid gap-4">
            {mitigationPlans.map((plan) => (
              <Card key={plan.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                      <p className="text-slate-400">Assigned to: {plan.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {plan.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-300">{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Due Date: {plan.dueDate}</span>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Monitoring Dashboard</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time monitoring of risk indicators and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Monitoring Dashboard</h3>
                <p>Real-time risk monitoring features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Management</CardTitle>
              <CardDescription className="text-slate-400">
                Track compliance status and regulatory requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Compliance Tracking</h3>
                <p>Compliance management features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
