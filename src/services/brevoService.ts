// Serviço de integração com Brevo (Sendinblue)
// Para envio de emails transacionais e automações

const BREVO_API_URL = 'https://api.brevo.com/v3';
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

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
  private headers = {
    'accept': 'application/json',
    'api-key': BREVO_API_KEY || '',
    'content-type': 'application/json'
  };

  /**
   * Enviar email transacional
   */
  async sendEmail(params: EmailParams) {
    try {
      const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          sender: params.sender || {
            email: 'noreply@gseedworks.com.br',
            name: 'Gseed Works'
          },
          to: params.to,
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent,
          templateId: params.templateId,
          params: params.params
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar email');
      }

      return await response.json();
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
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: 'Bem-vindo(a) ao Gseed Works!',
      templateId: 2, // ALTERE para o ID do seu template no Brevo
      params: {
        userName,
        loginUrl: `${window.location.origin}/login`,
        profileUrl: `${window.location.origin}/perfil`
      }
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
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: `Nova proposta recebida - ${projectTitle}`,
      templateId: 4, // ALTERE para o ID do seu template no Brevo
      params: {
        userName,
        projectTitle,
        proposalUrl: `${window.location.origin}/propostas-recebidas?id=${proposalId}`
      }
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
    return this.sendEmail({
      to: [{ email, name: userName }],
      subject: `Sua proposta foi aceita! - ${projectTitle}`,
      templateId: 5, // ALTERE para o ID do seu template no Brevo
      params: {
        userName,
        projectTitle,
        dashboardUrl: `${window.location.origin}/perfil`
      }
    });
  }

  /**
   * Adicionar contato à lista de marketing
   */
  async addContactToList(email: string, name: string, listId: number) {
    try {
      const response = await fetch(`${BREVO_API_URL}/contacts`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name.split(' ')[0],
            LASTNAME: name.split(' ').slice(1).join(' ') || ''
          },
          listIds: [listId],
          updateEnabled: true
        })
      });

      if (!response.ok && response.status !== 400) { // 400 = contato já existe
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar contato');
      }

      return await response.json();
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
}

export const brevoService = new BrevoService();
