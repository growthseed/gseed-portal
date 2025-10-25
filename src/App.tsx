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
import ProfissionaisPage from './pages/ProfissionaisPage';
import ProjetosPage from './pages/ProjetosPage';
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
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Rotas PÚBLICAS - Apenas listagens */}
            <Route 
              path="/" 
              element={
                <PublicLayout>
                  <ProjetosPage />
                </PublicLayout>
              } 
            />
            <Route 
              path="/profissionais" 
              element={
                <PublicLayout>
                  <ProfissionaisPage />
                </PublicLayout>
              } 
            />
            <Route 
              path="/projetos" 
              element={
                <PublicLayout>
                  <ProjetosPage />
                </PublicLayout>
              } 
            />

            {/* Rotas de Autenticação */}
            <Route path="/login" element={user ? <Navigate to="/perfil" /> : <Login />} />
            <Route path="/cadastro" element={user ? <Navigate to="/perfil" /> : <Register />} />
            <Route path="/register" element={user ? <Navigate to="/perfil" /> : <Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Navigate to="/perfil" replace />} />

            {/* Rota de Onboarding - NOVA */}
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

            {/* Rotas PROTEGIDAS - Detalhes e Interações */}
            <Route
              path="/projetos/:id"
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
              path="/profissionais/:id"
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
            <Route
              path="/perfil"
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
              path="/configuracoes"
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
            <Route
              path="/propostas"
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
            <Route
              path="/meus-projetos"
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
            <Route
              path="/propostas-recebidas"
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
            <Route
              path="/criar-projeto"
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
            <Route
              path="/criar-vaga"
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
            <Route
              path="/notificacoes"
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
