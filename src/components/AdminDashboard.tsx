
import { useAuth } from '@/hooks/useAuth';
import { AdminSignupManagement } from './AdminSignupManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Settings, LogOut, BarChart3, Activity, Zap, Database, Globe, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="modern-card max-w-md animate-fade-scale">
          <CardContent className="p-10 text-center">
            <div className="w-16 h-16 bg-destructive rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-destructive-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground text-lg">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  VulnTracker Admin
                </h1>
                <p className="text-muted-foreground text-lg font-medium">Advanced Security Platform Administration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-3"
                >
                  <BarChart3 className="h-5 w-5" />
                  Main Dashboard
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg border border-border">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="modern-card hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                System Status
              </CardTitle>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">Online</div>
              <p className="text-sm text-muted-foreground mb-4">
                All services operational
              </p>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">99.9% uptime</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                User Management
              </CardTitle>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">Active</div>
              <p className="text-sm text-muted-foreground mb-4">
                User registration and approval system
              </p>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-semibold">Real-time sync</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Security
              </CardTitle>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">Secure</div>
              <p className="text-sm text-muted-foreground mb-4">
                RLS policies active
              </p>
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-semibold">Enterprise grade</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <AdminSignupManagement />
      </main>
    </div>
  );
};
