import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, User, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Account Error",
            description: "There was an issue accessing your account.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        if (!profile) {
          toast({
            title: "Account Not Found",
            description: "Your account is pending admin approval.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        if (profile.status !== 'approved') {
          toast({
            title: "Account Pending",
            description: "Your account is still pending admin approval.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: requestError } = await supabase
        .from('signup_requests')
        .insert({
          email: signupForm.email,
          first_name: signupForm.firstName,
          last_name: signupForm.lastName,
          password_hash: signupForm.password,
        });

      if (requestError) {
        if (requestError.code === '23505') {
          toast({
            title: "Request Already Exists",
            description: "A signup request for this email already exists.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Error",
            description: requestError.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Signup Request Submitted",
        description: "Your signup request has been submitted for admin approval. You will receive an email once approved.",
      });

      setSignupForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordForm.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        toast({
          title: "Reset Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10 animate-slide-up">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-float">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-glow"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-2">
            VulnTracker
          </h1>
          <p className="text-slate-400 text-lg font-medium">Advanced Security Platform</p>
        </div>

        <Card className="glass-card animate-fade-scale">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <Zap className="h-6 w-6 text-indigo-400" />
              Welcome
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg">
              Sign in to your account or request access
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 rounded-lg transition-all duration-300">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 rounded-lg transition-all duration-300">Sign Up</TabsTrigger>
                <TabsTrigger value="forgot" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 rounded-lg transition-all duration-300">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-300 font-semibold">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-12 input-modern h-12 text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-slate-300 font-semibold">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-12 input-modern h-12 text-lg"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-12 text-lg font-semibold"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-300 font-semibold">First Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <Input
                          id="firstName"
                          type="text"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                          className="pl-12 input-modern h-12 text-lg"
                          placeholder="First name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-300 font-semibold">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                        className="input-modern h-12 text-lg"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupEmail" className="text-slate-300 font-semibold">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        id="signupEmail"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="pl-12 input-modern h-12 text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupPassword" className="text-slate-300 font-semibold">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        id="signupPassword"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-12 input-modern h-12 text-lg"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-12 text-lg font-semibold"
                  >
                    Request Access
                  </Button>
                  <p className="text-xs text-slate-400 text-center">
                    Your request will be reviewed by an administrator
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="forgot">
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <Label htmlFor="resetEmail" className="text-slate-300 font-semibold">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        id="resetEmail"
                        type="email"
                        value={forgotPasswordForm.email}
                        onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, email: e.target.value })}
                        className="pl-12 input-modern h-12 text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-12 text-lg font-semibold"
                  >
                    Send Reset Link
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
