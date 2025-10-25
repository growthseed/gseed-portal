/**
 * Serviço de Som de Notificação
 * 
 * Gerencia a reprodução de sons quando notificações são recebidas.
 * Respeita as preferências do usuário armazenadas no localStorage.
 */

class NotificationSoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;
  
  private readonly STORAGE_KEY = 'gseed_notification_sound_enabled';
  private readonly VOLUME_KEY = 'gseed_notification_volume';

  constructor() {
    // Carregar preferências do localStorage
    this.loadPreferences();
  }

  /**
   * Inicializar AudioContext (só quando necessário)
   */
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Carregar preferências do localStorage
   */
  private loadPreferences() {
    try {
      const savedEnabled = localStorage.getItem(this.STORAGE_KEY);
      const savedVolume = localStorage.getItem(this.VOLUME_KEY);
      
      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true';
      }
      
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de som:', error);
    }
  }

  /**
   * Salvar preferências no localStorage
   */
  private savePreferences() {
    try {
      localStorage.setItem(this.STORAGE_KEY, String(this.enabled));
      localStorage.setItem(this.VOLUME_KEY, String(this.volume));
    } catch (error) {
      console.error('Erro ao salvar preferências de som:', error);
    }
  }

  /**
   * Tocar som de notificação
   * Usa Web Audio API para gerar um som agradável
   */
  async play() {
    // Não tocar se desabilitado
    if (!this.enabled) return;

    // Não tocar se a página estiver visível (usuário já está vendo)
    if (document.visibilityState === 'visible' && document.hasFocus()) {
      return;
    }

    try {
      const context = this.initAudioContext();
      
      // Criar oscillators para um som agradável (tríade maior: C - E - G)
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      const now = context.currentTime;
      const duration = 0.15;
      
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Envelope ADSR suave
        gainNode.gain.setValueAtTime(0, now + index * 0.08);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + index * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start(now + index * 0.08);
        oscillator.stop(now + index * 0.08 + duration);
      });
    } catch (error) {
      console.error('Erro ao tocar som de notificação:', error);
    }
  }

  /**
   * Tocar som de teste (sempre toca, mesmo com página visível)
   */
  async playTest() {
    if (!this.enabled) return;

    try {
      const context = this.initAudioContext();
      const notes = [523.25, 659.25, 783.99];
      const now = context.currentTime;
      const duration = 0.15;
      
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0, now + index * 0.08);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + index * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start(now + index * 0.08);
        oscillator.stop(now + index * 0.08 + duration);
      });
    } catch (error) {
      console.error('Erro ao tocar som de teste:', error);
    }
  }

  /**
   * Habilitar/desabilitar som
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
   * Definir volume (0.0 - 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.savePreferences();
  }

  /**
   * Obter volume atual
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Limpar recursos
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Exportar instância singleton
export const notificationSoundService = new NotificationSoundService();
