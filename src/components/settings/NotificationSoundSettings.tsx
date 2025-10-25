import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { notificationSoundService } from '@/services/notificationSound';

export function NotificationSoundSettings() {
  const [enabled, setEnabled] = useState(notificationSoundService.isEnabled());
  const [volume, setVolume] = useState(notificationSoundService.getVolume());

  useEffect(() => {
    // Atualizar estado quando componente montar
    setEnabled(notificationSoundService.isEnabled());
    setVolume(notificationSoundService.getVolume());
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    notificationSoundService.setEnabled(newEnabled);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    notificationSoundService.setVolume(newVolume);
  };

  const handleTestSound = () => {
    notificationSoundService.playTest();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {enabled ? (
            <Volume2 className="h-6 w-6 text-blue-600" />
          ) : (
            <VolumeX className="h-6 w-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Som de Notificação
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Reproduzir um som quando você receber novas notificações
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

          {enabled && (
            <div className="mt-4 space-y-4">
              {/* Controle de Volume */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Volume
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Botão de Teste */}
              <button
                onClick={handleTestSound}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Play className="h-4 w-4" />
                Testar Som
              </button>

              {/* Informações Adicionais */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 <strong>Dica:</strong> O som não será reproduzido quando você estiver visualizando 
                  ativamente a página. Ele é projetado para alertá-lo quando você estiver em outra aba ou janela.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
