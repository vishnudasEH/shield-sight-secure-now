
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

interface CreateUserResponse {
  success?: boolean;
  user_id?: string;
  message?: string;
  error?: string;
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
      // Create user account using Supabase Auth Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: 'TempPass123!', // Temporary password - user should reset
        email_confirm: true,
        user_metadata: {
          first_name: request.first_name,
          last_name: request.last_name,
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Error",
          description: `Failed to create user account: ${authError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: request.first_name,
            last_name: request.last_name,
            role: 'user',
            status: 'approved'
          });

        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Error",
            description: `Failed to create user profile: ${profileError.message}`,
            variant: "destructive",
          });
          return;
        }

        // Update signup request status
        const { error: updateError } = await supabase
          .from('signup_requests')
          .update({ 
            status: 'approved',
            processed_at: new Date().toISOString()
          })
          .eq('id', request.id);

        if (updateError) {
          console.error('Update error:', updateError);
        }

        toast({
          title: "User Approved",
          description: `${request.first_name} ${request.last_name} has been approved. They can login with temporary password: TempPass123!`,
        });

        // Refresh the list
        fetchRequests();
      }
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
      const { error } = await supabase
        .from('signup_requests')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        console.error('Error rejecting request:', error);
        toast({
          title: "Error",
          description: "Failed to reject request",
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
      console.error('Error:', error);
    } finally {
      setProcessing(null);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Call the database function to create user
      const { data, error } = await supabase.rpc('create_user_account', {
        user_email: newUserForm.email,
        user_password: newUserForm.password,
        user_first_name: newUserForm.firstName,
        user_last_name: newUserForm.lastName,
        user_role: newUserForm.role
      });

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Error",
          description: `Failed to create user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Type assertion for the response
      const response = data as CreateUserResponse;

      if (response?.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      // Now create the actual auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        email_confirm: true,
        user_metadata: {
          first_name: newUserForm.firstName,
          last_name: newUserForm.lastName,
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        toast({
          title: "Error",
          description: `Failed to create auth user: ${authError.message}`,
          variant: "destructive",
        });
        return;
      }

      // Update the profile with the correct auth user ID
      if (authData.user && response?.user_id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ id: authData.user.id })
          .eq('id', response.user_id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }
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
      console.error('Error:', error);
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
