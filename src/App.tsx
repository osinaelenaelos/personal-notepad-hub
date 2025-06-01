
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Index';
import Users from '@/pages/Users';
import Pages from '@/pages/Pages';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичный маршрут авторизации */}
          <Route path="/auth/admin/login" element={<AdminLogin />} />
          
          {/* Защищенные маршруты */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/pages" element={<Pages />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
