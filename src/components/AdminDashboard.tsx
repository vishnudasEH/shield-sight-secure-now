
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <Card className="glass-card max-w-md relative z-10 animate-fade-scale">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Access Denied</h2>
            <p className="text-slate-400 text-lg">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <header className="relative z-10 glass-card border-b-0 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                  <Shield className="h-9 w-9 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-glow"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  VulnTracker Admin
                </h1>
                <p className="text-slate-400 text-lg font-medium">Advanced Security Platform Administration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-3 glass-card hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <BarChart3 className="h-5 w-5" />
                  Main Dashboard
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl glass-card">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-red-500/20 px-4 py-3 rounded-xl transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="glass-card hover:scale-105 transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-slate-300">
                System Status
              </CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">Online</div>
              <p className="text-sm text-slate-400 mb-4">
                All services operational
              </p>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400 font-semibold">99.9% uptime</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-slate-300">
                User Management
              </CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">Active</div>
              <p className="text-sm text-slate-400 mb-4">
                User registration and approval system
              </p>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-semibold">Real-time sync</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:scale-105 transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold text-slate-300">
                Security
              </CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">Secure</div>
              <p className="text-sm text-slate-400 mb-4">
                RLS policies active
              </p>
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-semibold">Enterprise grade</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <AdminSignupManagement />
      </main>
    </div>
  );
};
