import { createClient } from '@supabase/supabase-js';

// Fallback robusto para garantir que a Vercel encontre as chaves
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 🛡️ TRAVA DE CORS: Prevenção de bloqueios no navegador
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 🧠 LÓGICA INTELIGENTE: Conta APENAS quem pagou E vai de van!
    const { count, error } = await supabase
      .from('participantes')
      .select('*', { count: 'exact', head: true })
      .eq('pago', true)
      .eq('tipo_ingresso', 'com_transporte'); // O SEGREDO ESTÁ AQUI!

    if (error) throw error;

    res.status(200).json({ total: count || 0 });
  } catch (error) {
    console.error("Erro na API checar-vagas:", error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
}