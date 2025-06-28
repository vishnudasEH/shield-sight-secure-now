
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, UserX, Clock, Plus } from 'lucide-react';

interface SignupRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  status: string;
}

interface NewUserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const AdminSignupManagement = () => {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user'
  });

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('signup_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Error",
          description: "Failed to fetch signup requests",
          variant: "destructive",
        });
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (request: SignupRequest) => {
    setProcessing(request.id);

    try {
      console.log('Approving user request:', request.id);

      // Call the secure edge function instead of using Admin API directly
      const { data, error } = await supabase.functions.invoke('approve-user', {
        body: {
          requestId: request.id,
          userData: {
            email: request.email,
            first_name: request.first_name,
            last_name: request.last_name,
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Error",
          description: `Failed to approve user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data.success) {
        console.error('Approval failed:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to approve user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User Approved",
        description: `${request.first_name} ${request.last_name} has been approved. Temporary password: ${data.temporaryPassword}`,
      });

      // Refresh the list
      fetchRequests();

    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const rejectRequest = async (request: SignupRequest) => {
    setProcessing(request.id);

    try {
      console.log('Rejecting user request:', request.id);

      // Call the secure edge function for rejection
      const { data, error } = await supabase.functions.invoke('reject-user', {
        body: {
          requestId: request.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Error",
          description: `Failed to reject user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data.success) {
        console.error('Rejection failed:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to reject user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Request Rejected",
        description: `Request from ${request.first_name} ${request.last_name} has been rejected.`,
      });

      // Refresh the list
      fetchRequests();

    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      console.log('Creating new user:', newUserForm.email);

      // Call the secure edge function for user creation
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUserForm.email,
          password: newUserForm.password,
          firstName: newUserForm.firstName,
          lastName: newUserForm.lastName,
          role: newUserForm.role,
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Error",
          description: `Failed to create user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data.success) {
        console.error('User creation failed:', data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to create user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User Created",
        description: `User ${newUserForm.firstName} ${newUserForm.lastName} has been created successfully.`,
      });

      // Reset form
      setNewUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'user'
      });

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading signup requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Signup Requests</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Signup Requests Management</CardTitle>
              <CardDescription>
                Review and approve user signup requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No signup requests found
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{request.first_name} {request.last_name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-xs text-gray-400">
                          Requested: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => approveRequest(request)}
                            disabled={processing === request.id}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {processing === request.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectRequest(request)}
                            disabled={processing === request.id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New User
              </CardTitle>
              <CardDescription>
                Manually create a new user account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUserForm.firstName}
                      onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUserForm.lastName}
                      onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? 'Creating User...' : 'Create User'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
