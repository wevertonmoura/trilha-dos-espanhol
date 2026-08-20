import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    // CORREÇÃO: Apontando para a tabela 'participantes', que é a mesma 
    // usada no gerar-pix.js e no webhook.js!
    const { count, error } = await supabase
      .from('participantes')
      .select('*', { count: 'exact', head: true })
      .eq('pago', true); // Conta apenas quem já teve o PIX aprovado

    if (error) throw error;

    res.status(200).json({ total: count || 0 });
  } catch (error) {
    console.error("Erro na API checar-vagas:", error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
}