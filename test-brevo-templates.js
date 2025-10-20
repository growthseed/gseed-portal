// Script para listar templates do Brevo
// Execute com: node test-brevo-templates.js

const BREVO_API_KEY = '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';
const BREVO_API_URL = 'https://api.brevo.com/v3';

async function listTemplates() {
  try {
    console.log('🔍 Buscando templates no Brevo...\n');
    
    const response = await fetch(`${BREVO_API_URL}/smtp/templates`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro ${response.status}: ${error.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    
    console.log(`✅ Total de templates encontrados: ${data.count || 0}\n`);
    
    if (data.templates && data.templates.length > 0) {
      console.log('📧 TEMPLATES DISPONÍVEIS:\n');
      console.log('='.repeat(80));
      
      data.templates.forEach((template, index) => {
        console.log(`\n${index + 1}. ID: ${template.id}`);
        console.log(`   Nome: ${template.name}`);
        console.log(`   Assunto: ${template.subject || 'N/A'}`);
        console.log(`   Ativo: ${template.isActive ? 'Sim' : 'Não'}`);
        console.log(`   Criado em: ${template.createdAt || 'N/A'}`);
        console.log(`   Modificado em: ${template.modifiedAt || 'N/A'}`);
      });
      
      console.log('\n' + '='.repeat(80));
      
      // Procurar templates de onboarding
      const onboardingTemplates = data.templates.filter(t => 
        t.name.toLowerCase().includes('onboarding') ||
        t.name.toLowerCase().includes('bem-vindo') ||
        t.name.toLowerCase().includes('boas-vindas') ||
        t.name.toLowerCase().includes('welcome')
      );
      
      if (onboardingTemplates.length > 0) {
        console.log('\n\n🎯 TEMPLATES DE ONBOARDING ENCONTRADOS:\n');
        onboardingTemplates.forEach(t => {
          console.log(`   ✉️  ID ${t.id}: ${t.name}`);
        });
      }
      
    } else {
      console.log('⚠️  Nenhum template encontrado no Brevo.');
      console.log('\nPara criar templates, acesse:');
      console.log('https://app.brevo.com/camp/lists/template');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nDetalhes:', error);
  }
}

listTemplates();
