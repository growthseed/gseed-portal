import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { preferencesService } from '../services/preferencesService';
import { authService } from '../services/authService';
import { LanguageSwitcher } from '../components/i18n/LanguageSwitcher';
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Lock,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

export default function Configuracoes() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'geral' | 'privacidade' | 'notificacoes'>('geral');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificacoes, setNotificacoes] = useState({
    email_new_proposals: true,
    email_messages: true,
    email_project_updates: true,
    marketing_emails: false,
  });

  const [privacidade, setPrivacidade] = useState({
    profile_visibility: 'public' as 'public' | 'private' | 'connections_only',
    show_email_public: false,
    show_phone_public: false,
    show_whatsapp_public: true,
  });

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    const result = await preferencesService.getPreferences(user.id);
    
    if (result.success && result.data) {
      setNotificacoes({
        email_new_proposals: result.data.email_new_proposals,
        email_messages: result.data.email_messages,
        email_project_updates: result.data.email_project_updates,
        marketing_emails: result.data.marketing_emails,
      });
      
      setPrivacidade({
        profile_visibility: result.data.profile_visibility,
        show_email_public: result.data.show_email_public,
        show_phone_public: result.data.show_phone_public,
        show_whatsapp_public: result.data.show_whatsapp_public,
      });
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const result = await preferencesService.savePreferences(user.id, {
      ...notificacoes,
      ...privacidade
    });
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast.error(t('settings.messages.userNotFound'));
      return;
    }

    // Validações
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error(t('settings.messages.fillAllFields'));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(t('settings.messages.passwordTooShort'));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('settings.messages.passwordsDontMatch'));
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      toast.error(t('settings.messages.passwordMustBeDifferent'));
      return;
    }

    setChangingPassword(true);

    const result = await authService.changePassword(
      user.email,
      passwordForm.oldPassword,
      passwordForm.newPassword
    );

    if (result.success) {
      toast.success(result.message);
      // Limpar o formulário
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error(result.message);
    }

    setChangingPassword(false);
  };

  const tabs = [
    { id: 'geral' as const, label: t('settings.tabs.general'), icon: User },
    { id: 'privacidade' as const, label: t('settings.tabs.privacy'), icon: Shield },
    { id: 'notificacoes' as const, label: t('settings.tabs.notifications'), icon: Bell },
  ];

  const themeOptions = [
    { value: 'light' as const, label: t('settings.light'), icon: Sun, description: t('settings.lightDesc') },
    { value: 'dark' as const, label: t('settings.dark'), icon: Moon, description: t('settings.darkDesc') },
    { value: 'system' as const, label: t('settings.system'), icon: Monitor, description: t('settings.systemDesc') },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gseed-50 dark:bg-gseed-900/20 text-gseed-700 dark:text-gseed-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            
            {/* Tab: Geral */}
            {activeTab === 'geral' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {t('settings.general.title')}
                  </h2>

                  {/* Tema */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.appearance')}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isActive = theme === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                              isActive
                                ? 'border-gseed-500 bg-gseed-50 dark:bg-gseed-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-gseed-500 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                            <Icon 
                              size={24} 
                              className={isActive ? 'text-gseed-600 dark:text-gseed-400' : 'text-gray-400 dark:text-gray-500'} 
                            />
                            <p className={`mt-2 font-medium text-sm ${
                              isActive ? 'text-gseed-700 dark:text-gseed-400' : 'text-gray-900 dark:text-gray-300'
                            }`}>
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Idioma */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      <Globe size={18} className="inline mr-2" />
                      {t('settings.language')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('settings.selectLanguage')}
                    </p>
                    <LanguageSwitcher variant="dropdown" showLabel={true} />
                  </div>
                </div>

                {/* Alterar Senha */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    <Lock size={18} className="inline mr-2" />
                    {t('settings.general.changePassword')}
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder={t('settings.general.currentPassword')}
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={t('settings.general.newPassword')}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('settings.general.confirmNewPassword')}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500 focus:border-transparent"
                        disabled={changingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button 
                      type="submit"
                      disabled={changingPassword}
                      className="px-6 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? t('settings.general.changingPassword') : t('settings.general.changePasswordButton')}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab: Privacidade */}
            {activeTab === 'privacidade' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('settings.privacy.title')}
                </h2>
                <div className="space-y-6">
                  {/* Visibilidade do Perfil */}
                  <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.privacy.profileVisibility')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.privacy.profileVisibilityDesc')}
                      </p>
                    </div>
                    <select
                      value={privacidade.profile_visibility}
                      onChange={(e) => setPrivacidade({ ...privacidade, profile_visibility: e.target.value as 'public' | 'private' | 'connections_only' })}
                      className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-gseed-500"
                    >
                      <option value="public">{t('settings.privacy.visibilityPublic')}</option>
                      <option value="connections_only">{t('settings.privacy.visibilityConnections')}</option>
                      <option value="private">{t('settings.privacy.visibilityPrivate')}</option>
                    </select>
                  </div>

                  {/* Mostrar Email */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.privacy.showEmail')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.privacy.showEmailDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacidade.show_email_public}
                        onChange={(e) => setPrivacidade({ ...privacidade, show_email_public: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>

                  {/* Mostrar Telefone */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.privacy.showPhone')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.privacy.showPhoneDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacidade.show_phone_public}
                        onChange={(e) => setPrivacidade({ ...privacidade, show_phone_public: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>

                  {/* Mostrar WhatsApp */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.privacy.showWhatsapp')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.privacy.showWhatsappDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacidade.show_whatsapp_public}
                        onChange={(e) => setPrivacidade({ ...privacidade, show_whatsapp_public: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notificações */}
            {activeTab === 'notificacoes' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('settings.notifications.title')}
                </h2>
                <div className="space-y-6">
                  {/* Novas Propostas */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.notifications.newProposals')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.notifications.newProposalsDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoes.email_new_proposals}
                        onChange={(e) => setNotificacoes({ ...notificacoes, email_new_proposals: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>

                  {/* Mensagens */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.notifications.messages')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.notifications.messagesDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoes.email_messages}
                        onChange={(e) => setNotificacoes({ ...notificacoes, email_messages: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>

                  {/* Atualizações de Projeto */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.notifications.projectUpdates')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.notifications.projectUpdatesDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoes.email_project_updates}
                        onChange={(e) => setNotificacoes({ ...notificacoes, email_project_updates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>

                  {/* Marketing e Novidades */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t('settings.notifications.marketing')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.notifications.marketingDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoes.marketing_emails}
                        onChange={(e) => setNotificacoes({ ...notificacoes, marketing_emails: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gseed-300 dark:peer-focus:ring-gseed-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gseed-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button - Apenas para Privacidade e Notificações */}
          {(activeTab === 'privacidade' || activeTab === 'notificacoes') && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="px-8 py-3 bg-gseed-500 hover:bg-gseed-600 text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t('settings.saving') : t('settings.saveChanges')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
