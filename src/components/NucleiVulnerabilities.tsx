
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, Filter, Download, Eye, User, AlertTriangle, CheckCircle, Clock, 
  XCircle, RefreshCw, BarChart3, PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCenter } from "@/components/NotificationCenter";
import { NucleiVulnerabilityCharts } from "@/components/NucleiVulnerabilityCharts";
import { NucleiSLADashboard } from "@/components/NucleiSLADashboard";
import { nucleiService, NucleiVulnerability } from "@/services/nucleiService";

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export const NucleiVulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState<NucleiVulnerability[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState<NucleiVulnerability | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("vulnerabilities");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hostFilter, setHostFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchVulnerabilities();
    fetchUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nuclei_vulnerabilities',
        },
        (payload) => {
          fetchVulnerabilities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVulnerabilities = async () => {
    try {
      setLoading(true);
      const vulnerabilityData = await nucleiService.getAllVulnerabilities({
        severity: severityFilter !== 'all' ? severityFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        host: hostFilter || undefined,
        assignee: assigneeFilter !== 'all' ? assigneeFilter : undefined,
        search: searchTerm || undefined
      });
      
      // Apply sorting
      const sortedData = [...vulnerabilityData].sort((a, b) => {
        const fieldA = a[sortField as keyof NucleiVulnerability];
        const fieldB = b[sortField as keyof NucleiVulnerability];
        
        // Handle numeric and string comparisons
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        }
        
        // Handle dates
        if (sortField === 'created_at' || sortField === 'updated_at' || sortField === 'matched_at') {
          const dateA = new Date(fieldA as string).getTime();
          const dateB = new Date(fieldB as string).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle strings
        const strA = String(fieldA || '').toLowerCase();
        const strB = String(fieldB || '').toLowerCase();
        
        return sortDirection === 'asc' 
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
      
      setVulnerabilities(sortedData);
    } catch (error: any) {
      console.error('Error fetching vulnerabilities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vulnerabilities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('status', 'approved');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'info': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'false_positive': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'false_positive': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSLAStatusBadge = (vulnerability: NucleiVulnerability) => {
    if (!vulnerability.days_since_creation) return null;

    if (vulnerability.is_sla_breach) {
      return (
        <Badge className="bg-red-500/20 text-red-400">
          SLA Breached ({vulnerability.days_since_creation} days)
        </Badge>
      );
    }

    if (vulnerability.sla_days_remaining! <= 3) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400">
          Due Soon ({vulnerability.sla_days_remaining} days)
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-500/20 text-green-400">
        {vulnerability.sla_days_remaining} days remaining
      </Badge>
    );
  };

  const handleAssign = async () => {
    if (!selectedVuln || !selectedAssignee || !user) return;

    try {
      await nucleiService.assignVulnerability(
        selectedVuln.id,
        selectedAssignee,
        user.id
      );

      toast({
        title: "Assignment Successful",
        description: "Vulnerability has been assigned successfully",
      });

      setIsAssignDialogOpen(false);
      setSelectedAssignee("");
      fetchVulnerabilities();
    } catch (error: any) {
      console.error('Error assigning vulnerability:', error);
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign vulnerability",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!selectedVuln || !commentText.trim() || !user) return;
    
    try {
      // Create a comment record
      const { error } = await supabase
        .from('vulnerability_comments')
        .insert({
          vulnerability_id: selectedVuln.id,
          created_by: user.id,
          comment_text: commentText.trim(),
        });

      if (error) throw error;

      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully",
      });

      setIsCommentDialogOpen(false);
      setCommentText("");

      // If the vulnerability is assigned to someone, notify them
      if (selectedVuln.assigned_to && selectedVuln.assigned_to !== user.id) {
        await supabase.from('user_notifications').insert({
          user_id: selectedVuln.assigned_to,
          title: 'New Comment on Vulnerability',
          message: `New comment added to "${selectedVuln.template_name}"`,
          is_read: false,
          related_item_type: 'vulnerability',
          related_item_id: selectedVuln.id
        });
      }
      
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (vulnId: string, newStatus: string) => {
    if (!user) return;
    
    try {
      await nucleiService.updateStatus(vulnId, newStatus, user.id);

      toast({
        title: "Status Updated",
        description: `Vulnerability status changed to ${newStatus.replace('_', ' ')}`,
      });

      fetchVulnerabilities();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = async () => {
    try {
      const csvContent = await nucleiService.exportToCSV();
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nuclei_vulnerabilities_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Vulnerability data has been exported to CSV",
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  const filteredVulnerabilities = vulnerabilities;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading vulnerabilities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nuclei Vulnerabilities</h1>
          <p className="text-slate-400">Manage and track vulnerabilities detected by Nuclei scanner</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          
          <Button 
            variant="outline" 
            onClick={() => fetchVulnerabilities()} 
            className="border-slate-600"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-slate-700">
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="charts" className="data-[state=active]:bg-slate-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sla" className="data-[state=active]:bg-slate-700">
            <PieChart className="h-4 w-4 mr-2" />
            SLA & Aging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Nuclei Vulnerabilities
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage and track nuclei scan vulnerabilities with assignment and status tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <Label className="text-slate-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search vulnerabilities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Severity</Label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Host</Label>
                  <Input
                    placeholder="Filter by host..."
                    value={hostFilter}
                    onChange={(e) => setHostFilter(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Assignee</Label>
                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={exportToCSV} variant="outline" className="border-slate-600">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Vulnerabilities Table */}
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('template_name')}
                      >
                        <div className="flex items-center gap-1">
                          Vulnerability
                          {sortField === 'template_name' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('severity')}
                      >
                        <div className="flex items-center gap-1">
                          Severity
                          {sortField === 'severity' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('host')}
                      >
                        <div className="flex items-center gap-1">
                          Host
                          {sortField === 'host' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('vuln_status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === 'vuln_status' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('days_since_creation')}
                      >
                        <div className="flex items-center gap-1">
                          Age / SLA
                          {sortField === 'days_since_creation' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('assigned_to')}
                      >
                        <div className="flex items-center gap-1">
                          Assigned To
                          {sortField === 'assigned_to' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-slate-300 cursor-pointer"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          {sortField === 'created_at' && (
                            sortDirection === 'asc' ? '↑' : '↓'
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVulnerabilities.map((vuln) => (
                      <TableRow key={vuln.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell>
                          <div>
                            <div className="text-white font-medium">{vuln.template_name}</div>
                            <div className="text-slate-400 text-sm">{vuln.vuln_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{vuln.host}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(vuln.vuln_status)}
                            <Badge className={getStatusColor(vuln.vuln_status)}>
                              {vuln.vuln_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSLAStatusBadge(vuln)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {getUserName(vuln.assigned_to)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(vuln.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-slate-600"
                                  onClick={() => setSelectedVuln(vuln)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white">{vuln.template_name}</DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    Vulnerability details and information
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-slate-300">Vulnerability ID</Label>
                                      <p className="text-white">{vuln.vuln_id}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Template ID</Label>
                                      <p className="text-white">{vuln.template_id}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Host</Label>
                                      <p className="text-white">{vuln.host}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Severity</Label>
                                      <Badge className={getSeverityColor(vuln.severity)}>
                                        {vuln.severity.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Status</Label>
                                      <Badge className={getStatusColor(vuln.vuln_status)}>
                                        {vuln.vuln_status.replace('_', ' ').toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Created</Label>
                                      <p className="text-white">{new Date(vuln.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">Age</Label>
                                      <p className="text-white">{vuln.days_since_creation} days</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-300">SLA Status</Label>
                                      <div>{getSLAStatusBadge(vuln)}</div>
                                    </div>
                                  </div>
                                  {vuln.description && (
                                    <div>
                                      <Label className="text-slate-300">Description</Label>
                                      <p className="text-white mt-1 p-3 bg-slate-700/50 rounded-md border border-slate-600">
                                        {vuln.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-600"
                              onClick={() => {
                                setSelectedVuln(vuln);
                                setIsAssignDialogOpen(true);
                              }}
                            >
                              <User className="h-3 w-3" />
                            </Button>

                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-600"
                              onClick={() => {
                                setSelectedVuln(vuln);
                                setIsCommentDialogOpen(true);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            </Button>

                            <Select
                              value={vuln.vuln_status}
                              onValueChange={(newStatus) => handleStatusUpdate(vuln.id, newStatus)}
                            >
                              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="false_positive">False Positive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredVulnerabilities.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No vulnerabilities found matching the current filters.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <NucleiVulnerabilityCharts />
        </TabsContent>
        
        <TabsContent value="sla">
          <NucleiSLADashboard />
        </TabsContent>
      </Tabs>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Vulnerability</DialogTitle>
            <DialogDescription className="text-slate-400">
              Assign this vulnerability to a team member for resolution
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Vulnerability</Label>
              <p className="text-white font-medium">{selectedVuln?.template_name}</p>
              <p className="text-slate-400 text-sm">{selectedVuln?.host}</p>
            </div>
            <div>
              <Label className="text-slate-300">Assign To</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAssignDialogOpen(false)}
                className="border-slate-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssign}
                disabled={!selectedAssignee}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Comment</DialogTitle>
            <DialogDescription className="text-slate-400">
              Add a comment to this vulnerability
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Vulnerability</Label>
              <p className="text-white font-medium">{selectedVuln?.template_name}</p>
              <p className="text-slate-400 text-sm">{selectedVuln?.host}</p>
            </div>
            <div>
              <Label className="text-slate-300">Comment</Label>
              <Textarea
                placeholder="Enter your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCommentDialogOpen(false)}
                className="border-slate-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
