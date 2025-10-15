import { useState } from 'react';
import { OnboardingChoiceModal } from './OnboardingChoiceModal';
import { SignUpForm } from './SignUpForm';
import { ProfessionalSignupForm, ProfessionalData } from './ProfessionalSignupForm';
import { professionalService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type FlowStep = 'choice' | 'signup' | 'professional-form' | 'contractor-form' | 'loading' | 'success';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FlowStep>('choice');
  const [selectedType, setSelectedType] = useState<'professional' | 'contractor' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PASSO 1: Escolher tipo
  const handleSelectType = (type: 'professional' | 'contractor') => {
    setSelectedType(type);
    setCurrentStep('signup');
  };

  // PASSO 2: Cadastro (email/senha)
  const handleSignUpSuccess = (newUserId: string, userType: 'professional' | 'contractor') => {
    setUserId(newUserId);
    
    if (userType === 'professional') {
      setCurrentStep('professional-form');
    } else {
      setCurrentStep('contractor-form');
    }
  };

  // PASSO 3: Completar perfil profissional
  const handleProfessionalFormComplete = async (data: ProfessionalData) => {
    if (!userId) {
      setError('Erro: usuário não identificado');
      return;
    }

    setCurrentStep('loading');
    setError(null);

    try {
      // Salvar perfil profissional no Supabase
      await professionalService.createProfessionalProfile(userId, data);

      // Sucesso!
      setCurrentStep('success');
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      setError(err.message || 'Erro ao salvar perfil. Tente novamente.');
      setCurrentStep('professional-form');
    }
  };

  // PASSO 3 (alternativo): Completar perfil contratante
  const handleContractorFormComplete = () => {
    // TODO: Implementar fluxo do contratante
    setCurrentStep('success');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  // Voltar
  const handleBack = () => {
    if (currentStep === 'signup') {
      setCurrentStep('choice');
      setSelectedType(null);
    } else if (currentStep === 'professional-form' || currentStep === 'contractor-form') {
      setCurrentStep('signup');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      {/* PASSO 1: Escolha do tipo */}
      {currentStep === 'choice' && (
        <OnboardingChoiceModal
          isOpen={true}
          onClose={handleClose}
          onSelectContratante={() => handleSelectType('contractor')}
          onSelectProfissional={() => handleSelectType('professional')}
        />
      )}

      {/* PASSO 2: Cadastro (email/senha) */}
      {currentStep === 'signup' && selectedType && (
        <SignUpForm
          userType={selectedType}
          onSuccess={handleSignUpSuccess}
          onBack={handleBack}
        />
      )}

      {/* PASSO 3: Formulário profissional */}
      {currentStep === 'professional-form' && (
        <ProfessionalSignupForm
          onComplete={handleProfessionalFormComplete}
          onBack={handleBack}
        />
      )}

      {/* PASSO 3 (alternativo): Formulário contratante */}
      {currentStep === 'contractor-form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Em breve!
            </h2>
            <p className="text-gray-600 mb-6">
              O cadastro para contratantes está em desenvolvimento.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {currentStep === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-gseed-500" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Salvando seu perfil...
            </h3>
            <p className="text-gray-600">
              Aguarde um momento
            </p>
          </div>
        </div>
      )}

      {/* Success */}
      {currentStep === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Bem-vindo ao Gseed Jobs!
            </h3>
            <p className="text-gray-600">
              Seu perfil foi criado com sucesso. Redirecionando...
            </p>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && currentStep !== 'loading' && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
