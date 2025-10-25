/**
 * Serviço de Desktop Notifications
 * 
 * Gerencia notificações do navegador (Web Notifications API)
 * para alertar o usuário mesmo quando a aba não está ativa.
 */

export type NotificationPermission = 'default' | 'granted' | 'denied';

class DesktopNotificationService {
  private enabled: boolean = true;
  private readonly STORAGE_KEY = 'gseed_desktop_notifications_enabled';

  constructor() {
    this.loadPreferences();
  }

  /**
   * Carregar preferências do localStorage
   */
  private loadPreferences() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de desktop notifications:', error);
    }
  }

  /**
   * Salvar preferências no localStorage
   */
  private savePreferences() {
    try {
      localStorage.setItem(this.STORAGE_KEY, String(this.enabled));
    } catch (error) {
      console.error('Erro ao salvar preferências de desktop notifications:', error);
    }
  }

  /**
   * Verificar se o navegador suporta notificações
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Obter status atual da permissão
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission as NotificationPermission;
  }

  /**
   * Solicitar permissão do usuário
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Desktop notifications não são suportadas neste navegador');
      return 'denied';
    }

    if (this.getPermission() === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission as NotificationPermission;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return 'denied';
    }
  }

  /**
   * Mostrar notificação desktop
   */
  async show(title: string, options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
  }) {
    // Não mostrar se desabilitado
    if (!this.enabled) return null;

    // Não mostrar se navegador não suporta
    if (!this.isSupported()) return null;

    // Não mostrar se a página estiver visível e em foco
    if (document.visibilityState === 'visible' && document.hasFocus()) {
      return null;
    }

    // Verificar permissão
    const permission = this.getPermission();
    if (permission !== 'granted') {
      console.warn('Permissão de notificação não concedida');
      return null;
    }

    try {
      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/logo.png',
        badge: options?.badge || '/logo-badge.png',
        tag: options?.tag,
        data: options?.data,
        requireInteraction: options?.requireInteraction || false,
        silent: false,
      });

      // Auto-fechar após 5 segundos se não for requireInteraction
      if (!options?.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Erro ao mostrar notificação desktop:', error);
      return null;
    }
  }

  /**
   * Mostrar notificação específica de mensagem
   */
  async showMessageNotification(senderName: string, messagePreview: string, conversationId: string) {
    return this.show(`💬 Nova mensagem de ${senderName}`, {
      body: messagePreview,
      tag: `message-${conversationId}`,
      data: {
        type: 'message',
        conversationId,
      },
    });
  }

  /**
   * Mostrar notificação de nova proposta
   */
  async showProposalNotification(professionalName: string, projectTitle: string, proposalId: string) {
    return this.show('📨 Nova proposta recebida!', {
      body: `${professionalName} enviou uma proposta para "${projectTitle}"`,
      tag: `proposal-${proposalId}`,
      data: {
        type: 'proposal',
        proposalId,
      },
    });
  }

  /**
   * Mostrar notificação de proposta aceita
   */
  async showProposalAcceptedNotification(projectTitle: string, proposalId: string) {
    return this.show('🎉 Proposta Aceita!', {
      body: `Sua proposta para "${projectTitle}" foi aceita!`,
      tag: `proposal-accepted-${proposalId}`,
      data: {
        type: 'proposal_accepted',
        proposalId,
      },
      requireInteraction: true, // Requer interação do usuário
    });
  }

  /**
   * Mostrar notificação de proposta recusada
   */
  async showProposalRejectedNotification(projectTitle: string, proposalId: string) {
    return this.show('Proposta Recusada', {
      body: `Sua proposta para "${projectTitle}" foi recusada.`,
      tag: `proposal-rejected-${proposalId}`,
      data: {
        type: 'proposal_rejected',
        proposalId,
      },
    });
  }

  /**
   * Mostrar notificação de novo projeto relevante
   */
  async showNewProjectNotification(projectTitle: string, matchingSkills: number, projectId: string) {
    return this.show('💼 Novo projeto disponível!', {
      body: `Um projeto que combina com ${matchingSkills} ${matchingSkills === 1 ? 'habilidade sua' : 'habilidades suas'}: "${projectTitle}"`,
      tag: `project-${projectId}`,
      data: {
        type: 'project',
        projectId,
      },
    });
  }

  /**
   * Mostrar notificação de teste
   */
  async showTestNotification() {
    return this.show('🔔 Teste de Notificação', {
      body: 'Se você está vendo isso, as notificações desktop estão funcionando!',
      tag: 'test-notification',
      requireInteraction: false,
    });
  }

  /**
   * Habilitar/desabilitar notificações
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.savePreferences();
  }

  /**
   * Verificar se está habilitado
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Verificar se pode mostrar notificações
   * (suportado + permissão concedida + habilitado)
   */
  canShow(): boolean {
    return (
      this.isSupported() &&
      this.getPermission() === 'granted' &&
      this.enabled
    );
  }

  /**
   * Obter status completo do serviço
   */
  getStatus() {
    return {
      supported: this.isSupported(),
      permission: this.getPermission(),
      enabled: this.enabled,
      canShow: this.canShow(),
    };
  }
}

// Exportar instância singleton
export const desktopNotificationService = new DesktopNotificationService();
