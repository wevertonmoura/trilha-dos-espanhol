export default async function handler(req, res) {
  const { paymentId } = req.query;

  if (!paymentId) {
    return res.status(400).json({ error: 'ID do pagamento não fornecido' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` 
      }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao consultar o Mercado Pago' });
  }
}export default async function handler(req, res) {
  const { paymentId } = req.query;

  if (!paymentId) {
    return res.status(400).json({ error: 'ID do pagamento não fornecido' });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` 
      }
    });
    
    if (!response.ok) {
      throw new Error('Falha na comunicação com o Mercado Pago');
    }

    const data = await response.json();
    
    // 🛡️ TRAVA DE SEGURANÇA: 
    // Em vez de devolver todos os dados sensíveis da transação para o navegador, 
    // devolvemos APENAS o status que o frontend precisa para aprovar a tela.
    return res.status(200).json({ status: data.status });
    
  } catch (error) {
    console.error("Erro na API checar-pagamento:", error);
    return res.status(500).json({ error: 'Erro ao consultar o Mercado Pago' });
  }
}