export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔔 WEBHOOK RECEBIDO!');
    console.log('Method:', req.method);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));

    // Supabase config
    const SUPABASE_URL = 'https://kclffcufbqfyfyrinvcn.supabase.co';
    // IMPORTANTE: Use a Service Role Key (encontrada em Settings → API)
    // Ela tem permissão para chamar Edge Functions
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbGZmY3VmYnFmeWZ5cmludmNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE1ODcyMiwiZXhwIjoyMDczNzM0NzIyfQ.Br69Gf7qqeuK3xa0-3_Th413No1WxePfuudRvJqnCnU';

    // Preparar dados EXATAMENTE como o MP envia
    const webhookData = {
      ...req.body,
      // Se vier vazio (notificação GET), pega do query
      data: req.body.data || { 
        id: req.query.id || req.query['data.id'] 
      },
      type: req.body.type || req.query.topic || 'payment',
      action: req.body.action || 'payment.updated',
      // NÃO É TESTE MANUAL - VAI PROCESSAR DE VERDADE
      manual_test: false
    };

    console.log('📤 Enviando para Supabase...');

    // Chamar Edge Function do Supabase
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY
        },
        body: JSON.stringify(webhookData)
      }
    );

    const responseData = await response.text();
    
    console.log('Status Supabase:', response.status);
    console.log('Resposta:', responseData);

    // SEMPRE retornar 200 para o MP
    return res.status(200).json({
      success: true,
      supabase_status: response.status,
      message: 'Webhook processado'
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    
    // Sempre retornar 200
    return res.status(200).json({
      success: false,
      error: error.message
    });
  }
}
