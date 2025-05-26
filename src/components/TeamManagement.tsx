
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Mail, Shield, Edit, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Security Analyst",
    permissions: "Admin",
    assignedVulns: 12,
    resolvedVulns: 45,
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Senior Security Engineer",
    permissions: "Admin",
    assignedVulns: 8,
    resolvedVulns: 67,
    lastActive: "1 hour ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Security Specialist",
    permissions: "Editor",
    assignedVulns: 15,
    resolvedVulns: 32,
    lastActive: "30 minutes ago",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Compliance Officer",
    permissions: "Viewer",
    assignedVulns: 5,
    resolvedVulns: 23,
    lastActive: "4 hours ago",
    avatar: "/placeholder.svg"
  },
];

const roles = [
  { value: "security-analyst", label: "Security Analyst" },
  { value: "security-engineer", label: "Security Engineer" },
  { value: "compliance-officer", label: "Compliance Officer" },
  { value: "security-manager", label: "Security Manager" },
];

const permissions = [
  { value: "admin", label: "Admin", description: "Full system access" },
  { value: "editor", label: "Editor", description: "Can modify vulnerabilities" },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
];

export const TeamManagement = () => {
  const getPermissionColor = (permission) => {
    switch (permission) {
      case "Admin": return "bg-red-500/20 text-red-400";
      case "Editor": return "bg-blue-500/20 text-blue-400";
      case "Viewer": return "bg-green-500/20 text-green-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
            <p className="text-xs text-slate-400">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Assignments</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {teamMembers.reduce((sum, member) => sum + member.assignedVulns, 0)}
            </div>
            <p className="text-xs text-slate-400">Across all team members</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Resolved</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {teamMembers.reduce((sum, member) => sum + member.resolvedVulns, 0)}
            </div>
            <p className="text-xs text-slate-400">This quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg. Resolution Time</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.2d</div>
            <p className="text-xs text-slate-400">-0.5 days improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage team members, roles, and permissions
              </CardDescription>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                      <Input id="firstName" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                      <Input id="lastName" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input id="email" type="email" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Role</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value} className="text-white">
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Permissions</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {permissions.map((permission) => (
                          <SelectItem key={permission.value} value={permission.value} className="text-white">
                            {permission.label} - {permission.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">Send Invitation</Button>
                    <Button variant="outline" className="border-slate-600">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-slate-600 text-slate-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-slate-300 font-medium">{member.name}</h3>
                    <p className="text-slate-400 text-sm">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-xs">{member.role}</span>
                      <Badge variant="secondary" className={getPermissionColor(member.permissions)}>
                        {member.permissions}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-2">
                    <div>
                      <div className="text-slate-300 font-medium">{member.assignedVulns}</div>
                      <div className="text-xs">Assigned</div>
                    </div>
                    <div>
                      <div className="text-slate-300 font-medium">{member.resolvedVulns}</div>
                      <div className="text-xs">Resolved</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Last active: {member.lastActive}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-slate-600">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Role Permissions</CardTitle>
          <CardDescription className="text-slate-400">
            Configure permissions for different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {permissions.map((permission) => (
              <div key={permission.value} className="p-4 rounded-lg border border-slate-600 bg-slate-700/50">
                <h3 className="text-slate-300 font-medium mb-2">{permission.label}</h3>
                <p className="text-slate-400 text-sm mb-3">{permission.description}</p>
                <div className="space-y-2 text-xs">
                  {permission.value === "admin" && (
                    <>
                      <div className="text-green-400">✓ Full system access</div>
                      <div className="text-green-400">✓ User management</div>
                      <div className="text-green-400">✓ System configuration</div>
                      <div className="text-green-400">✓ All vulnerability operations</div>
                    </>
                  )}
                  {permission.value === "editor" && (
                    <>
                      <div className="text-green-400">✓ View vulnerabilities</div>
                      <div className="text-green-400">✓ Modify vulnerabilities</div>
                      <div className="text-green-400">✓ Generate reports</div>
                      <div className="text-red-400">✗ User management</div>
                    </>
                  )}
                  {permission.value === "viewer" && (
                    <>
                      <div className="text-green-400">✓ View vulnerabilities</div>
                      <div className="text-green-400">✓ View reports</div>
                      <div className="text-red-400">✗ Modify data</div>
                      <div className="text-red-400">✗ User management</div>
                    </>
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
