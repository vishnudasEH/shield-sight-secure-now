
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, UserX, Clock } from 'lucide-react';

interface SignupRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  status: string;
}

export const AdminSignupManagement = () => {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

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
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: Math.random().toString(36).slice(-8), // Temporary password
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
          description: "Failed to create user account",
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
            description: "Failed to create user profile",
            variant: "destructive",
          });
          return;
        }

        // Update signup request status
        const { error: updateError } = await supabase
          .from('signup_requests')
          .update({ status: 'approved' })
          .eq('id', request.id);

        if (updateError) {
          console.error('Update error:', updateError);
        }

        toast({
          title: "User Approved",
          description: `${request.first_name} ${request.last_name} has been approved and can now login.`,
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
        .update({ status: 'rejected' })
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
  );
};
