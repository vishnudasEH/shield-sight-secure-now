
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/AuthPage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If user is logged in and is admin, redirect to admin dashboard
  if (user && profile && profile.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // If user is logged in but not admin, show regular app
  if (user && profile && profile.status === 'approved') {
    return (
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If not logged in, show auth page
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
