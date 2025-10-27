import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import { PublicLayout } from './components/layout/PublicLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import OnboardingFlow from './components/onboarding';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import AuthCallback from './pages/AuthCallback';
import ProfessionalsPage from './pages/ProfessionalsPage';
import ProjectsPage from './pages/ProjectsPage';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';
import ProjetoDetalhes from './pages/ProjetoDetalhes';
import ProfissionalDetalhes from './pages/ProfissionalDetalhes';
import MinhasPropostas from './pages/MinhasPropostas';
import MeusProjetos from './pages/MeusProjetos';
import CriarProjeto from './pages/CriarProjeto';
import CriarVaga from './pages/CriarVaga';
import PropostasRecebidas from './pages/PropostasRecebidas';
import Notifications from './pages/Notifications';
import ChatPage from './pages/Chat';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gseed-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* PUBLIC Routes - Listings only */}
            <Route 
              path="/" 
              element={
                <PublicLayout>
                  <ProjectsPage />
                </PublicLayout>
              } 
            />
            <Route 
              path="/professionals" 
              element={
                <PublicLayout>
                  <ProfessionalsPage />
                </PublicLayout>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <PublicLayout>
                  <ProjectsPage />
                </PublicLayout>
              } 
            />

            {/* Portuguese aliases for backward compatibility */}
            <Route path="/profissionais" element={<Navigate to="/professionals" replace />} />
            <Route path="/projetos" element={<Navigate to="/projects" replace />} />

            {/* Authentication Routes */}
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
            <Route path="/cadastro" element={user ? <Navigate to="/profile" /> : <Register />} />
            <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
            <Route path="/perfil" element={<Navigate to="/profile" replace />} />

            {/* Onboarding Route - NEW */}
            <Route 
              path="/onboarding" 
              element={
                user ? (
                  <Onboarding />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            {/* PROTECTED Routes - Details and Interactions */}
            <Route
              path="/projects/:id"
              element={
                user ? (
                  <Layout>
                    <ProjetoDetalhes />
                  </Layout>
                ) : (
                  <Navigate to="/login" state={{ returnTo: window.location.pathname }} />
                )
              }
            />
            <Route
              path="/professionals/:id"
              element={
                user ? (
                  <Layout>
                    <ProfissionalDetalhes />
                  </Layout>
                ) : (
                  <Navigate to="/login" state={{ returnTo: window.location.pathname }} />
                )
              }
            />
            
            {/* Portuguese aliases for detail pages */}
            <Route path="/projetos/:id" element={<Navigate to="/projects/:id" replace />} />
            <Route path="/profissionais/:id" element={<Navigate to="/professionals/:id" replace />} />
            
            <Route
              path="/profile"
              element={
                user ? (
                  <Layout>
                    <Perfil />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                user ? (
                  <Layout>
                    <Configuracoes />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />
            
            <Route
              path="/proposals"
              element={
                user ? (
                  <Layout>
                    <MinhasPropostas />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/propostas" element={<Navigate to="/proposals" replace />} />
            
            <Route
              path="/my-projects"
              element={
                user ? (
                  <Layout>
                    <MeusProjetos />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/meus-projetos" element={<Navigate to="/my-projects" replace />} />
            
            <Route
              path="/received-proposals"
              element={
                user ? (
                  <Layout>
                    <PropostasRecebidas />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/propostas-recebidas" element={<Navigate to="/received-proposals" replace />} />
            
            <Route
              path="/create-project"
              element={
                user ? (
                  <Layout>
                    <CriarProjeto />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/criar-projeto" element={<Navigate to="/create-project" replace />} />
            
            <Route
              path="/create-job"
              element={
                user ? (
                  <Layout>
                    <CriarVaga />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/criar-vaga" element={<Navigate to="/create-job" replace />} />
            
            <Route
              path="/notifications"
              element={
                user ? (
                  <Layout>
                    <Notifications />
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/notificacoes" element={<Navigate to="/notifications" replace />} />
            
            <Route
              path="/chat"
              element={
                user ? (
                  <ChatPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
