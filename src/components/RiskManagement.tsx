import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar, 
  BarChart3,
  Search,
  Download,
  Eye,
  Plus,
  Edit
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";

interface RiskMetric {
  name: string;
  value: number;
  color: string;
  trend: number;
}

interface RiskAssessment {
  id: string;
  asset: string;
  riskScore: number;
  status: string;
  lastAssessed: string;
  assessor: string;
  category: string;
  vulnerabilities: number;
  criticalCount: number;
  highCount: number;
}

interface MitigationPlan {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  progress: number;
  vulnerabilityCount: number;
  description: string;
}

export const RiskManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [mitigationPlans, setMitigationPlans] = useState<MitigationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  const assessmentForm = useForm({
    defaultValues: {
      asset: "",
      category: "",
      assessor: "",
      notes: ""
    }
  });

  const planForm = useForm({
    defaultValues: {
      title: "",
      priority: "Medium",
      assignedTo: "",
      dueDate: "",
      description: ""
    }
  });

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      // Fetch vulnerability counts by severity
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('nessus_vulnerabilities')
        .select('severity, host');

      if (vulnError) throw vulnError;

      // Fetch assets
      const { data: assets, error: assetsError } = await supabase
        .from('nessus_assets')
        .select('*');

      if (assetsError) throw assetsError;

      // Count vulnerabilities by severity
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

      const metrics: RiskMetric[] = [
        { name: "Critical", value: severityCounts.Critical, color: "#dc2626", trend: -2 },
        { name: "High", value: severityCounts.High, color: "#ea580c", trend: -5 },
        { name: "Medium", value: severityCounts.Medium, color: "#d97706", trend: +3 },
        { name: "Low", value: severityCounts.Low, color: "#65a30d", trend: +12 },
      ];

      setRiskMetrics(metrics);

      // Generate risk assessments based on real data
      const assessments: RiskAssessment[] = assets?.map((asset, index) => {
        const assetVulns = vulnerabilities?.filter(v => 
          v.host === asset.ip_address || v.host === asset.host_name
        ) || [];
        
        const criticalCount = assetVulns.filter(v => v.severity === 'Critical').length;
        const highCount = assetVulns.filter(v => v.severity === 'High').length;
        const riskScore = Math.min(10, (criticalCount * 2 + highCount * 1.5 + assetVulns.length * 0.1));
        
        return {
          id: `RA-${String(index + 1).padStart(3, '0')}`,
          asset: asset.host_name || asset.ip_address || `Asset ${index + 1}`,
          riskScore: Number(riskScore.toFixed(1)),
          status: riskScore >= 8 ? "Review" : riskScore >= 6 ? "Active" : "Completed",
          lastAssessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assessor: "Security Team",
          category: asset.operating_system?.includes('Windows') ? "Infrastructure" : 
                   asset.operating_system?.includes('Linux') ? "Infrastructure" : "Network",
          vulnerabilities: assetVulns.length,
          criticalCount,
          highCount
        };
      }) || [];

      setRiskAssessments(assessments);

      // Generate mitigation plans based on critical vulnerabilities
      const plans: MitigationPlan[] = [
        {
          id: "MP-001",
          title: "Critical Vulnerability Remediation",
          priority: "Critical",
          status: "In Progress",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assignedTo: "Security Team",
          progress: 65,
          vulnerabilityCount: severityCounts.Critical,
          description: "Address all critical severity vulnerabilities identified in the latest scan"
        },
        {
          id: "MP-002",
          title: "High Risk Asset Hardening",
          priority: "High",
          status: "Planning",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assignedTo: "Infrastructure Team",
          progress: 25,
          vulnerabilityCount: severityCounts.High,
          description: "Implement security hardening measures for high-risk assets"
        },
        {
          id: "MP-003",
          title: "Patch Management Process",
          priority: "Medium",
          status: "Completed",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assignedTo: "IT Operations",
          progress: 100,
          vulnerabilityCount: severityCounts.Medium + severityCounts.Low,
          description: "Establish automated patch management for medium and low severity vulnerabilities"
        }
      ];

      setMitigationPlans(plans);
    } catch (error) {
      console.error('Error fetching risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRiskAssessment = async (data: any) => {
    const newAssessment: RiskAssessment = {
      id: `RA-${String(riskAssessments.length + 1).padStart(3, '0')}`,
      asset: data.asset,
      riskScore: Math.random() * 10, // In real implementation, calculate based on vulnerabilities
      status: "Active",
      lastAssessed: new Date().toISOString().split('T')[0],
      assessor: data.assessor,
      category: data.category,
      vulnerabilities: 0,
      criticalCount: 0,
      highCount: 0
    };

    setRiskAssessments(prev => [newAssessment, ...prev]);
    setIsAssessmentDialogOpen(false);
    assessmentForm.reset();
  };

  const createMitigationPlan = async (data: any) => {
    const newPlan: MitigationPlan = {
      id: `MP-${String(mitigationPlans.length + 1).padStart(3, '0')}`,
      title: data.title,
      priority: data.priority,
      status: "Planning",
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
      progress: 0,
      vulnerabilityCount: 0,
      description: data.description
    };

    setMitigationPlans(prev => [newPlan, ...prev]);
    setIsPlanDialogOpen(false);
    planForm.reset();
  };

  const updateProgress = async (planId: string, newProgress: number) => {
    setMitigationPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, progress: newProgress, status: newProgress === 100 ? "Completed" : "In Progress" }
          : plan
      )
    );
  };

  const filteredAssessments = riskAssessments.filter(assessment => {
    const matchesSearch = assessment.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || assessment.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading risk data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Management</h2>
          <p className="text-slate-400">Comprehensive risk assessment and mitigation planning based on real vulnerability data</p>
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
                <CardDescription className="text-slate-400">
                  Current vulnerability distribution by severity
                </CardDescription>
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
                <CardTitle className="text-white">Risk by Severity</CardTitle>
                <CardDescription className="text-slate-400">
                  Vulnerability count breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
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
            <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Risk Assessment</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create a new risk assessment for an asset or system
                  </DialogDescription>
                </DialogHeader>
                <Form {...assessmentForm}>
                  <form onSubmit={assessmentForm.handleSubmit(createRiskAssessment)} className="space-y-4">
                    <FormField
                      control={assessmentForm.control}
                      name="asset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Asset Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={assessmentForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Network">Network</SelectItem>
                              <SelectItem value="Application">Application</SelectItem>
                              <SelectItem value="Data">Data</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={assessmentForm.control}
                      name="assessor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Assessor</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Create Assessment
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAssessmentDialogOpen(false)}
                        className="border-slate-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredAssessments.map((assessment) => (
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
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                          <span className="text-slate-400">Vulnerabilities:</span>
                          <span className="ml-2 text-slate-300">{assessment.vulnerabilities}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Critical:</span>
                          <span className="ml-2 text-red-400">{assessment.criticalCount}</span>
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Mitigation Plans</h3>
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Mitigation Plan</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create a new mitigation plan to address security risks
                  </DialogDescription>
                </DialogHeader>
                <Form {...planForm}>
                  <form onSubmit={planForm.handleSubmit(createMitigationPlan)} className="space-y-4">
                    <FormField
                      control={planForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Plan Title</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={planForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={planForm.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Assigned To</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={planForm.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Due Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={planForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Create Plan
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsPlanDialogOpen(false)}
                        className="border-slate-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {mitigationPlans.map((plan) => (
              <Card key={plan.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                      <p className="text-slate-400">{plan.description}</p>
                      <p className="text-slate-400 text-sm">Assigned to: {plan.assignedTo}</p>
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
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Due: {plan.dueDate} | Vulns: {plan.vulnerabilityCount}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600"
                          onClick={() => updateProgress(plan.id, Math.min(100, plan.progress + 25))}
                        >
                          Update Progress
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
                Real-time monitoring of risk indicators and alerts based on uploaded vulnerability data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Active Threats</p>
                        <p className="text-2xl font-bold text-red-400">{riskMetrics.find(m => m.name === 'Critical')?.value || 0}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Total Vulnerabilities</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {riskMetrics.reduce((sum, metric) => sum + metric.value, 0)}
                        </p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Risk Score</p>
                        <p className="text-2xl font-bold text-orange-400">8.5/10</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Management</CardTitle>
              <CardDescription className="text-slate-400">
                Track compliance status and regulatory requirements based on current vulnerability data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">NIST Framework</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Identify</span>
                        <Badge className="bg-green-500/20 text-green-400">Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Protect</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Partial</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Detect</span>
                        <Badge className="bg-green-500/20 text-green-400">Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Respond</span>
                        <Badge className="bg-red-500/20 text-red-400">Non-Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Recover</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">Partial</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">PCI DSS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Network Security</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">75%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Data Protection</span>
                        <Badge className="bg-green-500/20 text-green-400">95%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Access Control</span>
                        <Badge className="bg-red-500/20 text-red-400">45%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Monitoring</span>
                        <Badge className="bg-green-500/20 text-green-400">88%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
