# 🚀 Guia Rápido - Configuração de E-mails Gseed Works

## ⚡ Execução Rápida (10 minutos)

### 1️⃣ Criar Templates no Brevo (2 min)

```bash
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
npx tsx src/scripts/create-brevo-templates.ts
```

**O que acontece:**
- Cria 6 templates no Brevo
- Retorna IDs de cada template
- Templates ficam prontos para uso

**Resultado esperado:**
```
🚀 Criando templates no Brevo...
✅ Template "Gseed - Bem-vindo" criado com ID: 1
✅ Template "Gseed - Complete seu Perfil" criado com ID: 2
✅ Template "Gseed - Crie seu Primeiro Projeto" criado com ID: 3
✅ Template "Gseed - Como Encontrar Profissionais" criado com ID: 4
✅ Template "Gseed - Dicas para Propostas Efetivas" criado com ID: 5
✅ Template "Gseed - Cases de Sucesso" criado com ID: 6
🎉 Processo finalizado!
```

### 2️⃣ Anotar IDs e Atualizar Service (3 min)

**Passo A:** Acesse https://app.brevo.com/camp/lists/template

**Passo B:** Anote os IDs dos 6 templates criados

**Passo C:** Edite `src/services/email/emailSequenceService.ts` linha 15-22:

```typescript
const BREVO_TEMPLATE_IDS = {
  welcome: 1,              // ← Cole o ID do template "Bem-vindo"
  completeProfile: 2,      // ← Cole o ID do template "Complete seu Perfil"
  firstProject: 3,         // ← Cole o ID do template "Primeiro Projeto"
  findProfessionals: 4,    // ← Cole o ID do template "Encontrar Profissionais"
  effectiveProposals: 5,   // ← Cole o ID do template "Propostas Efetivas"
  successCases: 6          // ← Cole o ID do template "Cases de Sucesso"
};
```

### 3️⃣ Testar Sistema (5 min)

**Opção A: Teste Manual (Console do Navegador)**

```typescript
import EmailSequenceService from '@/services/email/emailSequenceService';

// Iniciar sequência para usuário teste
await EmailSequenceService.startOnboardingSequence({
  userId: 'seu-user-id-aqui',
  userEmail: 'seu@email.com',
  userName: 'Seu Nome'
});
```

**Opção B: Criar Novo Usuário**

1. Acesse: http://localhost:3000/register
2. Crie uma conta com seu e-mail
3. Verifique inbox - deve receber e-mail de boas-vindas

**Verificar no Banco:**

```sql
-- Ver sequência criada
SELECT * FROM email_sequences WHERE user_id = 'seu-user-id';

-- Ver e-mails agendados
SELECT * FROM scheduled_emails WHERE user_id = 'seu-user-id';
```

### 4️⃣ Configurar Cron Job (Escolha uma opção)

#### Opção A: Supabase Edge Function

```bash
# 1. Criar função
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
supabase functions new process-emails

# 2. Implementar (copie código abaixo)
# 3. Deploy
supabase functions deploy process-emails
```

**Código da Edge Function:**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!

  // Buscar e-mails pendentes
  const { data: emails } = await supabase
    .from('scheduled_emails')
    .select('*, profiles!inner(*)')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())

  // Enviar cada e-mail
  for (const email of emails || []) {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Gseed Works', email: 'grupo@gseed.com.br' },
        to: [{ email: email.profiles.email }],
        templateId: email.template_id,
        params: email.params
      })
    })

    await supabase
      .from('scheduled_emails')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', email.id)
  }

  return new Response(JSON.stringify({ processed: emails?.length || 0 }))
})
```

**Agendar (Cron):**
```bash
supabase functions schedule process-emails --cron "0 * * * *"
```

#### Opção B: Vercel Cron (Se hospedar na Vercel)

**1. Criar:** `app/api/cron/process-emails/route.ts`

```typescript
import { NextResponse } from 'next/server';
import EmailSequenceService from '@/services/email/emailSequenceService';

export async function GET(request: Request) {
  // Verificar autorização
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await EmailSequenceService.processScheduledEmails();
  
  return NextResponse.json({ success: true });
}
```

**2. Adicionar em `vercel.json`:**

```json
{
  "crons": [{
    "path": "/api/cron/process-emails",
    "schedule": "0 * * * *"
  }]
}
```

#### Opção C: EasyCron (Mais Simples)

1. Acesse: https://www.easycron.com/
2. Crie conta grátis
3. Adicione cron job:
   - URL: `https://seu-dominio.com/api/cron/process-emails`
   - Schedule: `0 * * * *` (a cada hora)
   - HTTP Header: `Authorization: Bearer ${CRON_SECRET}`

---

## ✅ Checklist Final

- [ ] Script de templates executado com sucesso
- [ ] 6 templates aparecendo no Brevo
- [ ] IDs atualizados no service
- [ ] Tabelas criadas no Supabase
- [ ] Teste enviou e-mail de boas-vindas
- [ ] E-mails agendados no banco
- [ ] Cron job configurado
- [ ] Primeiro processamento rodou

---

## 📊 Monitoramento

### Ver E-mails Agendados

```sql
SELECT 
  se.template_id,
  p.email,
  p.full_name,
  se.scheduled_for,
  se.status
FROM scheduled_emails se
JOIN profiles p ON p.id = se.user_id
WHERE se.status = 'pending'
ORDER BY se.scheduled_for;
```

### Ver Estatísticas

```typescript
const stats = await EmailSequenceService.getEmailStats(7);
console.log(stats);
// {
//   total: 100,
//   sent: 95,
//   pending: 3,
//   failed: 2,
//   successRate: '95%'
// }
```

---

## 🎨 Editar Templates

**Recomendado:** Edite direto no Brevo

1. Acesse: https://app.brevo.com/camp/lists/template
2. Clique no template
3. Edite no editor visual
4. Salve

**Vantagens:**
- ✅ Sem deploy
- ✅ Preview em tempo real
- ✅ A/B testing
- ✅ Marketing pode editar

---

## 🆘 Troubleshooting

### Templates não criados

```bash
# Verificar API key
echo $NEXT_PUBLIC_BREVO_API_KEY

# Rodar script novamente
npx tsx src/scripts/create-brevo-templates.ts
```

### E-mails não enviando

```bash
# Rodar processamento manual
npx tsx -e "
import EmailSequenceService from './src/services/email/emailSequenceService';
await EmailSequenceService.processScheduledEmails();
"
```

### E-mails vão para spam

1. Configurar DKIM/SPF no Brevo
2. Usar domínio personalizado
3. Fazer warming up

---

## 📈 Próximas Melhorias

- [ ] A/B testing de assuntos
- [ ] Segmentação por tipo de usuário
- [ ] Tracking de aberturas/cliques
- [ ] Dashboard de métricas
- [ ] Webhooks do Brevo

---

**Pronto! Sistema funcionando!** 🎉

Qualquer dúvida: grupo@gseed.com.br
