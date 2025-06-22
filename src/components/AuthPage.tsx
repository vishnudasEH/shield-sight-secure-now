import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, User } from 'lucide-react';
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10 animate-slide-up">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            VulnTracker
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Advanced Security Platform</p>
        </div>

        <Card className="modern-card animate-fade-scale">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-2xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10 input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 input-field"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full btn-primary">
                    {loading ? <div className="loading-spinner mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                          className="pl-10 input-field"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="pl-10 input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-10 input-field"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full btn-primary">
                    {loading ? <div className="loading-spinner mr-2" /> : null}
                    Request Access
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Tabs defaultValue="forgot" className="w-full">
                <TabsList className="inline-flex">
                  <TabsTrigger value="forgot" className="text-sm">Forgot Password?</TabsTrigger>
                </TabsList>
                <TabsContent value="forgot" className="mt-4">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgotEmail" className="text-foreground">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotPasswordForm.email}
                          onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                          className="pl-10 input-field"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full btn-secondary">
                      {loading ? <div className="loading-spinner mr-2" /> : null}
                      Send Reset Link
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
