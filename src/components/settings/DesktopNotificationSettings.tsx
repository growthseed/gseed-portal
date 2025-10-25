import React, { useState, useEffect } from 'react';
import { Bell, BellOff, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { desktopNotificationService, type NotificationPermission } from '@/services/desktopNotification';

export function DesktopNotificationSettings() {
  const [enabled, setEnabled] = useState(desktopNotificationService.isEnabled());
  const [permission, setPermission] = useState<NotificationPermission>(desktopNotificationService.getPermission());
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    // Atualizar estado quando componente montar
    setEnabled(desktopNotificationService.isEnabled());
    setPermission(desktopNotificationService.getPermission());
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    desktopNotificationService.setEnabled(newEnabled);
  };

  const handleRequestPermission = async () => {
    setRequesting(true);
    const newPermission = await desktopNotificationService.requestPermission();
    setPermission(newPermission);
    setRequesting(false);

    if (newPermission === 'granted') {
      setEnabled(true);
      desktopNotificationService.setEnabled(true);
    }
  };

  const handleTestNotification = async () => {
    await desktopNotificationService.showTestNotification();
  };

  const isSupported = desktopNotificationService.isSupported();

  // Renderizar mensagem se não for suportado
  if (!isSupported) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <BellOff className="h-6 w-6 text-gray-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Notificações Desktop
            </h3>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Seu navegador não suporta notificações desktop. 
                Considere atualizar para a versão mais recente ou usar Chrome, Firefox ou Edge.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar solicitação de permissão
  if (permission === 'default') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <Bell className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Notificações Desktop
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Receba alertas do navegador mesmo quando estiver em outra aba ou aplicativo
            </p>

            <button
              onClick={handleRequestPermission}
              disabled={requesting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {requesting ? 'Solicitando...' : 'Ativar Notificações Desktop'}
            </button>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                ℹ️ Uma janela aparecerá solicitando sua permissão. 
                Você pode revogar essa permissão a qualquer momento nas configurações do navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar permissão negada
  if (permission === 'denied') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <BellOff className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Notificações Desktop
            </h3>
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-1">Permissão negada</p>
                <p>
                  Você bloqueou as notificações para este site. Para ativá-las:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Clique no ícone 🔒 ou ⓘ na barra de endereços</li>
                  <li>Encontre "Notificações" nas configurações do site</li>
                  <li>Altere para "Permitir"</li>
                  <li>Recarregue a página</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar controles (permissão concedida)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {enabled ? (
            <Bell className="h-6 w-6 text-blue-600" />
          ) : (
            <BellOff className="h-6 w-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notificações Desktop
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Receber alertas do navegador quando estiver em outra aba
              </p>
            </div>

            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Status de Permissão */}
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              Permissão concedida
            </span>
          </div>

          {enabled && (
            <div className="space-y-4">
              {/* Botão de Teste */}
              <button
                onClick={handleTestNotification}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Play className="h-4 w-4" />
                Testar Notificação
              </button>

              {/* Informações Adicionais */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 <strong>Dica:</strong> As notificações desktop só aparecem quando você está em outra aba ou aplicativo. 
                  Quando você estiver visualizando a página, apenas o som será reproduzido (se ativado).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
