import React from 'react';
import { NotificationSoundSettings } from './NotificationSoundSettings';
import { DesktopNotificationSettings } from './DesktopNotificationSettings';

export function NotificationPreferences() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Preferências de Notificação
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure como você deseja receber notificações do GSeed Portal
        </p>
      </div>

      {/* Desktop Notifications */}
      <DesktopNotificationSettings />

      {/* Sound Notifications */}
      <NotificationSoundSettings />
    </div>
  );
}
