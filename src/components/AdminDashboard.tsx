
import { useAuth } from '@/hooks/useAuth';
import { AdminSignupManagement } from './AdminSignupManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Settings, LogOut, BarChart3, Activity, Zap } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="glass-effect border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Access Denied</h2>
            <p className="text-gray-400">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="relative z-10 glass-effect border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  VulnTracker Admin
                </h1>
                <p className="text-sm text-gray-400">Security Platform Administration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 glass-effect border border-white/10 hover:border-white/20 text-white hover:bg-white/10"
                >
                  <BarChart3 className="h-4 w-4" />
                  Main Dashboard
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full glass-effect border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-white/10 hover:border-white/20 transition-all duration-300 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                System Status
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400 mb-1">Online</div>
              <p className="text-xs text-gray-400 mb-3">
                All services operational
              </p>
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">99.9% uptime</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/10 hover:border-white/20 transition-all duration-300 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                User Management
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400 mb-1">Active</div>
              <p className="text-xs text-gray-400 mb-3">
                User registration and approval system
              </p>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Real-time sync</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/10 hover:border-white/20 transition-all duration-300 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Security
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400 mb-1">Secure</div>
              <p className="text-xs text-gray-400 mb-3">
                RLS policies active
              </p>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">Enterprise grade</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <AdminSignupManagement />
      </main>
    </div>
  );
};
