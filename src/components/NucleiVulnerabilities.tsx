
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
import { Search, Filter, Download, Eye, User, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Vulnerability {
  id: string;
  scan_id: string;
  vuln_id: string;
  vuln_status: string;
  template_name: string;
  severity: string;
  host: string;
  matched_at: string;
  template_id: string;
  description: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  last_status_change: string | null;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export const NucleiVulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  
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
  }, []);

  const fetchVulnerabilities = async () => {
    try {
      const { data, error } = await supabase
        .from('nuclei_vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVulnerabilities(data || []);
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

  const handleAssign = async () => {
    if (!selectedVuln || !selectedAssignee) return;

    try {
      const { error } = await supabase
        .from('nuclei_vulnerabilities')
        .update({
          assigned_to: selectedAssignee,
          assigned_by: user?.id,
          assigned_at: new Date().toISOString(),
          last_status_change: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedVuln.id);

      if (error) throw error;

      toast({
        title: "Assignment Successful",
        description: "Vulnerability has been assigned successfully",
      });

      setIsAssignDialogOpen(false);
      setSelectedAssignee("");
      setAssignmentNotes("");
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

  const handleStatusUpdate = async (vulnId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('nuclei_vulnerabilities')
        .update({
          vuln_status: newStatus,
          last_status_change: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', vulnId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Vulnerability status changed to ${newStatus}`,
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

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.vuln_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || vuln.vuln_status === statusFilter;
    const matchesHost = !hostFilter || vuln.host.toLowerCase().includes(hostFilter.toLowerCase());
    const matchesAssignee = assigneeFilter === "all" || 
                           (assigneeFilter === "unassigned" && !vuln.assigned_to) ||
                           vuln.assigned_to === assigneeFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesHost && matchesAssignee;
  });

  const getUserName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Template Name', 'Severity', 'Host', 'Status', 'Assigned To', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredVulnerabilities.map(vuln => 
        [
          vuln.vuln_id,
          `"${vuln.template_name}"`,
          vuln.severity,
          vuln.host,
          vuln.vuln_status,
          getUserName(vuln.assigned_to),
          new Date(vuln.created_at).toLocaleDateString()
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nuclei_vulnerabilities_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading vulnerabilities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  <TableHead className="text-slate-300">Vulnerability</TableHead>
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Host</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Assigned To</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
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
                            <Button size="sm" variant="outline" className="border-slate-600">
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
                              </div>
                              {vuln.description && (
                                <div>
                                  <Label className="text-slate-300">Description</Label>
                                  <p className="text-white mt-1">{vuln.description}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {profile?.role === 'admin' && (
                          <>
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
                          </>
                        )}
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
            <div>
              <Label className="text-slate-300">Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this assignment..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
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
    </div>
  );
};
