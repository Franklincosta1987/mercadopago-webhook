export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔔 Webhook recebido do Mercado Pago');
    console.log('📍 Body:', JSON.stringify(req.body, null, 2));
    console.log('📍 Query:', JSON.stringify(req.query, null, 2));

    // Retorna sucesso para o Mercado Pago
    return res.status(200).json({ 
      success: true,
      message: 'Webhook recebido com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}
