// Serviço de integração com Brevo (Sendinblue)
// Usando Edge Function como proxy para evitar CORS e problemas de IP

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://portal.gseed.com.br';
const BREVO_PROXY_URL = `${SUPABASE_URL}/functions/v1/brevo-proxy`;

interface EmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, any>;
  sender?: { email: string; name: string };
}

class BrevoService {
  /**
   * Chamada genérica ao proxy do Brevo
   */
  private async callBrevoProxy(action: string, params: any) {
    try {
      console.log(`[Brevo] Chamando ação: ${action}`);
      
      const response = await fetch(BREVO_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, params })
      });

      console.log(`[Brevo] Status: ${response.status} ${response.statusText}`);

      // CORREÇÃO: Verificar response.ok ANTES de parsear JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Brevo] Erro HTTP ${response.status}:`, errorText);
        throw new Error(`Erro ${response.status}: ${errorText || 'Falha na comunicação com Brevo'}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao comunicar com Brevo');
      }

      console.log(`[Brevo] Sucesso em ${action}`);
      return result.data;
    } catch (error: any) {
      console.error(`[Brevo] Erro no Brevo Proxy (${action}):`, error);
      throw error;
    }
  }

  /**
   * Enviar email transacional
   */
  async sendEmail(params: EmailParams) {
    try {
      return await this.callBrevoProxy('sendEmail', params);
    } catch (error) {
      console.error('Erro ao enviar email via Brevo:', error);
      throw error;
    }
  }

  /**
   * Enviar email de recuperação de senha
   */
  async sendPasswordResetEmail(email: string, resetUrl: string, userName?: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperação de Senha</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${userName || 'Usuário'}</strong>!</p>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Gseed Works</strong>.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </p>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
              <p><strong>Este link expira em 1 hora.</strong></p>
              <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gseed Works. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: '🔐 Recuperação de Senha - Gseed Works',
      htmlContent
    });
  }

  /**
   * Enviar email de boas-vindas
   */
  async sendWelcomeEmail(email: string, userName: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bem-vindo ao Gseed Works!</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${userName}</strong>!</p>
              <p>É um prazer tê-lo(a) conosco! Sua conta foi criada com sucesso.</p>
              
              <h2 style="color: #10b981; margin-top: 30px;">O que você pode fazer agora:</h2>
              
              <div class="feature">
                <strong>📋 Criar Projetos</strong>
                <p style="margin: 5px 0 0 0; color: #6b7280;">Publique seus projetos e receba propostas de profissionais qualificados.</p>
              </div>
              
              <div class="feature">
                <strong>💼 Enviar Propostas</strong>
                <p style="margin: 5px 0 0 0; color: #6b7280;">Encontre projetos interessantes e envie suas propostas.</p>
              </div>
              
              <div class="feature">
                <strong>👤 Completar Perfil</strong>
                <p style="margin: 5px 0 0 0; color: #6b7280;">Adicione suas informações e se destaque na plataforma.</p>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${SITE_URL}/login" class="button">Acessar Plataforma</a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Precisa de ajuda? Entre em contato conosco através do suporte.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gseed Works. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: '🎉 Bem-vindo ao Gseed Works!',
      htmlContent
    });
  }

  /**
   * Enviar email de confirmação de cadastro
   */
  async sendVerificationEmail(email: string, verificationUrl: string, userName?: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Confirme seu E-mail</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${userName || 'Usuário'}</strong>!</p>
              <p>Bem-vindo(a) ao <strong>Gseed Works</strong>! 🎉</p>
              <p>Para começar a usar sua conta, precisamos confirmar seu endereço de e-mail.</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Confirmar E-mail</a>
              </p>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
              <p><strong>Este link expira em 24 horas.</strong></p>
              <p>Se você não se cadastrou no Gseed Works, ignore este email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gseed Works. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: '✉️ Confirme seu E-mail - Gseed Works',
      htmlContent
    });
  }

  /**
   * Enviar notificação de nova proposta
   */
  async sendNewProposalNotification(
    email: string,
    userName: string,
    projectTitle: string,
    proposalId: string
  ) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .project-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📨 Nova Proposta Recebida!</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${userName}</strong>!</p>
              <p>Você recebeu uma nova proposta para o seu projeto:</p>
              
              <div class="project-box">
                <strong style="font-size: 18px; color: #10b981;">${projectTitle}</strong>
              </div>
              
              <p>Acesse a plataforma para visualizar os detalhes da proposta e interagir com o profissional.</p>
              
              <p style="text-align: center;">
                <a href="${SITE_URL}/propostas-recebidas?id=${proposalId}" class="button">Ver Proposta</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gseed Works. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: `📨 Nova proposta recebida - ${projectTitle}`,
      htmlContent
    });
  }

  /**
   * Enviar notificação de proposta aceita
   */
  async sendProposalAcceptedNotification(
    email: string,
    userName: string,
    projectTitle: string
  ) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .success-box { background: #d1fae5; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Proposta Aceita!</h1>
            </div>
            <div class="content">
              <p>Parabéns, <strong>${userName}</strong>!</p>
              
              <div class="success-box">
                <p style="margin: 0;"><strong>Sua proposta foi aceita!</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 18px;">${projectTitle}</p>
              </div>
              
              <p>O cliente aceitou sua proposta. Agora você pode começar a trabalhar no projeto!</p>
              <p>Acesse sua área de trabalho para mais detalhes.</p>
              
              <p style="text-align: center;">
                <a href="${SITE_URL}/perfil" class="button">Ir para Dashboard</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gseed Works. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: `🎉 Sua proposta foi aceita! - ${projectTitle}`,
      htmlContent
    });
  }

  /**
   * Adicionar contato à lista de marketing
   */
  async addContactToList(email: string, name: string, listId: number) {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      return await this.callBrevoProxy('addContact', {
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName || ''
        },
        listIds: [listId],
        updateEnabled: true
      });
    } catch (error) {
      console.error('Erro ao adicionar contato ao Brevo:', error);
      throw error;
    }
  }

  /**
   * Enviar email customizado (HTML direto)
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    htmlContent: string,
    toName?: string
  ) {
    return this.sendEmail({
      to: [{ email: to, name: toName }],
      subject,
      htmlContent
    });
  }

  /**
   * Verificar status da conta Brevo
   */
  async checkAccountStatus() {
    try {
      return await this.callBrevoProxy('getAccount', {});
    } catch (error) {
      console.error('Erro ao verificar conta Brevo:', error);
      throw error;
    }
  }
}

export const brevoService = new BrevoService();
