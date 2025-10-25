/**
 * Email Sequence Service - Gseed Works
 * 
 * Gerencia sequências automatizadas de e-mail usando:
 * - Brevo: Templates e envio
 * - Supabase: Agendamento e controle
 */

import { createClient } from '@supabase/supabase-js';

const BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ IDs ATUALIZADOS - Templates criados no Brevo
const BREVO_TEMPLATE_IDS = {
  welcome: 7,              // ✅ Gseed - 1. Bem-vindo
  completeProfile: 8,      // ✅ Gseed - 2. Complete seu Perfil
  firstProject: 9,         // ✅ Gseed - 3. Crie seu Primeiro Projeto
  findProfessionals: 10,   // ✅ Gseed - 4. Como Encontrar Profissionais
  effectiveProposals: 12,  // ✅ Gseed - 5. Dicas para Propostas Efetivas
  successCases: 13         // ✅ Gseed - 6. Cases de Sucesso
} as const;

interface EmailSequence {
  userId: string;
  userEmail: string;
  userName: string;
}

interface ScheduledEmail {
  userId: string;
  templateId: number;
  scheduledFor: Date;
  params: Record<string, any>;
}

class EmailSequenceService {
  /**
   * Envia e-mail usando template do Brevo
   */
  private static async sendBrevoEmail(
    to: string,
    templateId: number,
    params: Record<string, any>
  ): Promise<boolean> {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Gseed Works',
            email: 'grupo@gseed.com.br'
          },
          to: [{ email: to, name: params.name }],
          templateId: templateId,
          params: params
        })
      });

      if (!response.ok) {
        console.error('Erro ao enviar e-mail via Brevo:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  /**
   * Agenda um e-mail no Supabase
   */
  private static async scheduleEmail(data: ScheduledEmail): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scheduled_emails')
        .insert({
          user_id: data.userId,
          template_id: data.templateId,
          scheduled_for: data.scheduledFor.toISOString(),
          params: data.params,
          status: 'pending'
        });

      if (error) {
        console.error('Erro ao agendar e-mail:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao agendar e-mail:', error);
      return false;
    }
  }

  /**
   * Inicia sequência de onboarding completa
   */
  public static async startOnboardingSequence({
    userId,
    userEmail,
    userName
  }: EmailSequence): Promise<boolean> {
    try {
      const params = { name: userName };

      // 1. Enviar e-mail de boas-vindas imediatamente
      await this.sendBrevoEmail(
        userEmail,
        BREVO_TEMPLATE_IDS.welcome,
        params
      );

      // 2. Criar registro da sequência
      const { data: sequence, error: seqError } = await supabase
        .from('email_sequences')
        .insert({
          user_id: userId,
          sequence_type: 'onboarding',
          status: 'active',
          current_step: 1,
          total_steps: 6
        })
        .select()
        .single();

      if (seqError) {
        console.error('Erro ao criar sequência:', seqError);
        return false;
      }

      // 3. Agendar os próximos 5 e-mails
      const now = new Date();
      
      const emailsToSchedule = [
        {
          userId,
          templateId: BREVO_TEMPLATE_IDS.completeProfile,
          scheduledFor: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // +1 dia
          params
        },
        {
          userId,
          templateId: BREVO_TEMPLATE_IDS.firstProject,
          scheduledFor: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 dias
          params
        },
        {
          userId,
          templateId: BREVO_TEMPLATE_IDS.findProfessionals,
          scheduledFor: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 dias
          params
        },
        {
          userId,
          templateId: BREVO_TEMPLATE_IDS.effectiveProposals,
          scheduledFor: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 dias
          params
        },
        {
          userId,
          templateId: BREVO_TEMPLATE_IDS.successCases,
          scheduledFor: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // +10 dias
          params
        }
      ];

      for (const email of emailsToSchedule) {
        await this.scheduleEmail(email);
      }

      console.log(`✅ Sequência iniciada para ${userEmail}`);
      return true;

    } catch (error) {
      console.error('Erro ao iniciar sequência:', error);
      return false;
    }
  }

  /**
   * Processa e-mails agendados (Executar via Cron)
   */
  public static async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date();

      // Buscar e-mails pendentes que já deveriam ter sido enviados
      const { data: emails, error } = await supabase
        .from('scheduled_emails')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now.toISOString())
        .limit(50);

      if (error) {
        console.error('Erro ao buscar e-mails agendados:', error);
        return;
      }

      if (!emails || emails.length === 0) {
        console.log('Nenhum e-mail agendado para enviar');
        return;
      }

      console.log(`📧 Processando ${emails.length} e-mails agendados...`);

      for (const email of emails) {
        try {
          // Enviar e-mail via Brevo
          const sent = await this.sendBrevoEmail(
            email.profiles.email,
            email.template_id,
            email.params
          );

          // Atualizar status
          await supabase
            .from('scheduled_emails')
            .update({
              status: sent ? 'sent' : 'failed',
              sent_at: sent ? new Date().toISOString() : null,
              error_message: sent ? null : 'Erro ao enviar via Brevo'
            })
            .eq('id', email.id);

          // Atualizar progresso da sequência
          if (sent) {
            await supabase.rpc('increment_sequence_step', {
              p_user_id: email.user_id
            });
          }

          console.log(`${sent ? '✅' : '❌'} E-mail template ${email.template_id} para ${email.profiles.email}`);

        } catch (error) {
          console.error(`Erro ao processar e-mail ${email.id}:`, error);
        }
      }

      console.log('✅ Processamento concluído');

    } catch (error) {
      console.error('Erro ao processar e-mails:', error);
    }
  }

  /**
   * Pausa sequência de um usuário
   */
  public static async pauseSequence(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .update({ status: 'paused' })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Erro ao pausar sequência:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao pausar sequência:', error);
      return false;
    }
  }

  /**
   * Retoma sequência de um usuário
   */
  public static async resumeSequence(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .update({ status: 'active' })
        .eq('user_id', userId)
        .eq('status', 'paused');

      if (error) {
        console.error('Erro ao retomar sequência:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao retomar sequência:', error);
      return false;
    }
  }

  /**
   * Cancela sequência de um usuário
   */
  public static async cancelSequence(userId: string): Promise<boolean> {
    try {
      // Atualizar status da sequência
      await supabase
        .from('email_sequences')
        .update({ status: 'cancelled' })
        .eq('user_id', userId);

      // Cancelar e-mails pendentes
      await supabase
        .from('scheduled_emails')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'pending');

      return true;
    } catch (error) {
      console.error('Erro ao cancelar sequência:', error);
      return false;
    }
  }

  /**
   * Busca status da sequência de um usuário
   */
  public static async getSequenceStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select(`
          *,
          scheduled_emails (
            id,
            template_id,
            scheduled_for,
            status,
            sent_at
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar status da sequência:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      return null;
    }
  }

  /**
   * Busca estatísticas gerais de e-mails
   */
  public static async getEmailStats(days: number = 30) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from('scheduled_emails')
        .select('status')
        .gte('created_at', since.toISOString());

      if (error || !data) {
        return null;
      }

      const stats = {
        total: data.length,
        sent: data.filter(e => e.status === 'sent').length,
        pending: data.filter(e => e.status === 'pending').length,
        failed: data.filter(e => e.status === 'failed').length,
        cancelled: data.filter(e => e.status === 'cancelled').length
      };

      return {
        ...stats,
        successRate: stats.total > 0 
          ? ((stats.sent / stats.total) * 100).toFixed(2) + '%'
          : '0%'
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }
}

export default EmailSequenceService;
