
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthPage } from '@/components/AuthPage';
import { AdminDashboard } from '@/components/AdminDashboard';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import BitsightDashboard from '@/pages/BitsightDashboard';
import NucleiVulnerabilitiesPage from '@/pages/NucleiVulnerabilitiesPage';
import UserProfilePage from '@/pages/UserProfilePage';
import EnhancedAdminPage from '@/pages/EnhancedAdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/enhanced" 
              element={
                <ProtectedRoute requireAdmin>
                  <EnhancedAdminPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/bitsight" 
              element={
                <ProtectedRoute>
                  <BitsightDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/nuclei-vulnerabilities" 
              element={
                <ProtectedRoute>
                  <NucleiVulnerabilitiesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
