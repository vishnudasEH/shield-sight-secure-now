import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Key, 
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  banned_until: string;
}

export const EnhancedAdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  console.log('EnhancedAdminDashboard - Current user:', user?.email);
  console.log('EnhancedAdminDashboard - Current profile:', profile);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [searchTerm, roleFilter, statusFilter, currentPage, profile]);

  const fetchUsers = async () => {
    if (!profile || profile.role !== 'admin') {
      console.log('Not admin, skipping fetch');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling get_users_with_profiles RPC with params:', {
        search_term: searchTerm?.trim() || null,
        role_filter: roleFilter === 'all' ? null : roleFilter,
        status_filter: statusFilter === 'all' ? null : statusFilter,
        limit_count: pageSize,
        offset_count: currentPage * pageSize
      });
      
      const { data, error } = await supabase.rpc('get_users_with_profiles', {
        search_term: searchTerm?.trim() || null,
        role_filter: roleFilter === 'all' ? null : roleFilter,
        status_filter: statusFilter === 'all' ? null : statusFilter,
        limit_count: pageSize,
        offset_count: currentPage * pageSize
      });

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('RPC Error details:', error);
        setError(`Failed to fetch users: ${error.message}`);
        throw error;
      }
      
      console.log('Successfully fetched users:', data?.length || 0);
      setUsers(data || []);
      
      // Calculate total pages (approximate)
      setTotalPages(Math.ceil((data?.length || 0) / pageSize) + (data?.length === pageSize ? 1 : 0));
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch users',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is not admin
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="glass-effect border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Loading...</h2>
            <p className="text-gray-400">
              Checking authentication status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="glass-effect border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Access Denied</h2>
            <p className="text-gray-400 mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <p className="text-gray-500 text-sm">
              Current role: {profile?.role || 'none'} | Status: {profile?.status || 'none'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: ban ? '876000h' : 'none' // 876000h = ~100 years, 'none' = unban
      });

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_user_activity', {
        target_user_id: userId,
        action_type: ban ? 'user_banned' : 'user_unbanned',
        action_details: { admin_id: user?.id }
      });

      toast({
        title: "Success",
        description: `User has been ${ban ? 'banned' : 'unbanned'} successfully.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.user_id, {
        password: newPassword
      });

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_user_activity', {
        target_user_id: selectedUser.user_id,
        action_type: 'password_reset_by_admin',
        action_details: { admin_id: user?.id }
      });

      toast({
        title: "Success",
        description: "User password has been reset successfully.",
      });

      setNewPassword('');
      setShowPasswordReset(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_user_activity', {
        target_user_id: userId,
        action_type: 'role_changed',
        action_details: { 
          admin_id: user?.id,
          new_role: newRole
        }
      });

      toast({
        title: "Success",
        description: "User role has been updated successfully.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleConfirmUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true
      });

      if (error) throw error;

      // Also update profile status if needed
      await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', userId);

      // Log the activity
      await supabase.rpc('log_user_activity', {
        target_user_id: userId,
        action_type: 'user_confirmed',
        action_details: { admin_id: user?.id }
      });

      toast({
        title: "Success",
        description: "User has been confirmed successfully.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, bannedUntil: string) => {
    if (bannedUntil && bannedUntil !== 'none') {
      return <Badge variant="destructive">Banned</Badge>;
    }
    
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-purple-600">Admin</Badge>;
      case 'user':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Enhanced Admin Dashboard
          </h1>
          <p className="text-gray-400">Comprehensive user management and administration</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setCurrentPage(0);
                  }}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Last Sign In</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((userData) => (
                      <TableRow key={userData.user_id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {userData.first_name} {userData.last_name}
                            </p>
                            <p className="text-gray-400 text-sm">{userData.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(userData.role)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(userData.status, userData.banned_until)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {userData.last_sign_in_at ? new Date(userData.last_sign_in_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Ban/Unban */}
                            <Button
                              size="sm"
                              variant={userData.banned_until && userData.banned_until !== 'none' ? "default" : "destructive"}
                              onClick={() => handleBanUser(userData.user_id, !(userData.banned_until && userData.banned_until !== 'none'))}
                            >
                              {userData.banned_until && userData.banned_until !== 'none' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                            </Button>
                            
                            {/* Reset Password */}
                            <Dialog open={showPasswordReset && selectedUser?.user_id === userData.user_id} onOpenChange={(open) => {
                              setShowPasswordReset(open);
                              if (!open) setSelectedUser(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedUser(userData)}
                                  className="border-gray-600"
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-effect border-white/10">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Reset User Password</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Reset password for {userData.first_name} {userData.last_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label className="text-gray-300">New Password</Label>
                                    <Input
                                      type="password"
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      className="bg-gray-800/50 border-gray-700 text-white"
                                      placeholder="Enter new password"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      setShowPasswordReset(false);
                                      setSelectedUser(null);
                                      setNewPassword('');
                                    }}
                                    className="text-gray-400"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleResetPassword}
                                    disabled={!newPassword}
                                    className="bg-gradient-to-r from-red-600 to-red-700"
                                  >
                                    Reset Password
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            {/* Role Change */}
                            <Select 
                              value={userData.role} 
                              onValueChange={(value) => handleRoleChange(userData.user_id, value)}
                            >
                              <SelectTrigger className="w-24 h-8 bg-gray-800/50 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {/* Confirm User */}
                            {(!userData.email_confirmed_at || userData.status !== 'approved') && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleConfirmUser(userData.user_id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-gray-400 text-sm">
                Page {currentPage + 1} of {Math.max(1, totalPages)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="border-gray-600 text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={users.length < pageSize}
                  className="border-gray-600 text-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
