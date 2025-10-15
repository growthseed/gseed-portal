# 📧 Sistema de E-mails Automatizados - Gseed Works

## 🎯 Visão Geral

Sistema completo de sequências de e-mail usando **Brevo** para templates e envios, e **Supabase** para agendamento e controle.

## ✅ O que foi feito

✅ 6 templates profissionais criados
✅ Script de criação automática
✅ Service para gerenciar sequências  
✅ Integração Brevo + Supabase
✅ Documentação completa

## 🚀 Como Executar

### Passo 1: Criar Templates no Brevo (2 minutos)

```bash
cd "C:\Users\EFEITO DIGITAL\gseed-portal"
npx tsx src/scripts/create-brevo-templates.ts
```

Você verá algo como:
```
🚀 Criando templates no Brevo...
✅ Template "Gseed - Bem-vindo" criado com ID: 1
✅ Template "Gseed - Complete seu Perfil" criado com ID: 2
... (continua)
🎉 Processo finalizado!
```

### Passo 2: Anotar IDs (1 minuto)

Acesse: https://app.brevo.com/camp/lists/template

Anote os IDs de cada template.

### Passo 3: Atualizar Service (1 minuto)

Atualize os IDs no arquivo que vou criar a seguir.

## 📧 Templates Criados

### Sequência Onboarding:
1. **Bem-vindo** - Enviado imediatamente
2. **Complete seu Perfil** - Dia 1
3. **Crie seu Primeiro Projeto** - Dia 3

### Sequência Engajamento:
4. **Como Encontrar Profissionais** - Dia 5
5. **Dicas para Propostas Efetivas** - Dia 7
6. **Cases de Sucesso** - Dia 10

## 🔄 Como Funciona

```
Usuário se cadastra
    ↓
E-mail 1 enviado (Brevo)
    ↓
E-mails 2-6 agendados (Supabase)
    ↓
Cron roda a cada hora
    ↓
Envia e-mails agendados (Brevo)
```

## 📊 Monitoramento

```sql
-- Ver e-mails agendados
SELECT * FROM scheduled_emails WHERE status = 'pending';

-- Ver e-mails enviados
SELECT * FROM scheduled_emails WHERE status = 'sent';
```

## ✏️ Editar Templates

**Melhor forma**: Direto no Brevo
1. Acesse: https://app.brevo.com/camp/lists/template
2. Clique no template
3. Edite no editor visual
4. Salve

✅ Sem deploy
✅ Editor visual
✅ Preview

## 📚 Próximos Passos

Agora vou criar o service atualizado!
